from ortools.sat.python import cp_model
from flask import Flask, request, jsonify
from ortools.sat.python import cp_model
import logging

def solve_scheduling(tasks, people, unavailable_periods):
    model = cp_model.CpModel()

    # Adjusting the person available hours to span multiple days
    min_start_time = 0
    max_end_time = 24 * 60 * 7 * 10  # 7 days

    # Task variables
    task_starts = {}
    task_ends = {}
    task_intervals = {}
    person_tasks = {m_id: [] for m_id in people}
    assignments = {}  # Store which person is assigned to which task
    group_ends = {}

    # Create the task variables
    for task in tasks:
        duration = task['duration']
        start_var = model.NewIntVar(min_start_time, max_end_time, f"start_{task['id']}")
        end_var = model.NewIntVar(min_start_time, max_end_time, f"end_{task['id']}")
        interval_var = model.NewIntervalVar(start_var, duration, end_var, f"interval_{task['id']}")
        
        task_starts[task['id']] = start_var
        task_ends[task['id']] = end_var
        task_intervals[task['id']] = interval_var
        assignments[task['id']] = {}

        if task['patient'] not in group_ends:
            group_ends[task['patient']] = model.NewIntVar(min_start_time, max_end_time, f"group_end_{task['patient']}")
            model.Add(group_ends[task['patient']] >= end_var)

        for req in task['required_people']:
            if 'id' in req:
                # Specific person by ID
                assignments[task['id']][req['id']] = True
                person_tasks[req['id']].append(task_intervals[task['id']])
            elif 'type' in req:
                # Any person of a specific type, create a temporary list for possible person IDs
                possible_people = [m_id for m_id, m in people.items() if m['type'] == req['type']]
                
                bvars = []
                for m_id in possible_people:
                    bvar = model.NewBoolVar(f'use_{m_id}_{task["id"]}')
                    bvars.append(bvar)
                    assignments[task['id']][m_id] = bvar

                    person_interval = model.NewOptionalIntervalVar(start_var, duration, end_var, bvar, f"person_interval_{m_id}_{task['id']}")
                    person_tasks[m_id].append(person_interval)

                    # Enforcing availability hours per person
                    # model.Add(intervals[task['name']].StartExpr() >= people[m_id]['available_hours'][0]).OnlyEnforceIf(bvar)
                    # model.Add(intervals[task['name']].EndExpr() <= people[m_id]['available_hours'][1]).OnlyEnforceIf(bvar)
                # Require that exactly `req['count']` people of the specified type are used
                model.Add(sum(bvars) == req['count'])

        for start, end in unavailable_periods:
            model.AddNoOverlap([model.NewIntervalVar(start, end - start, end, 'unavailable')])

    # Task dependencies
    for task in tasks:
        model.Add(task_starts[task['id']] >= int(task['offset']))

        for subsequent_task_name in task['next']:
            #if (task['next'] in [t['id'] for t in tasks]):
            model.Add(task_ends[task['id']] + task['delay'] <= task_starts[subsequent_task_name])

    #  Ensure that people are not double-booked
    for m_id, intervals in person_tasks.items():
        if len(intervals) > 0:
            model.AddNoOverlap(intervals)

    max_group_end_time = model.NewIntVar(0, max_end_time, 'max_group_end_time')

    for group_end in group_ends.values():
        model.Add(max_group_end_time >= group_end)

    model.Minimize(max_group_end_time)

    solver = cp_model.CpSolver()
    solver.parameters.log_search_progress = True
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL:
        result = {'tasks': {}, 'assignments': {}}
        for task_id, info in assignments.items():
            result['tasks'][task_id] = {
                'start': solver.Value(task_starts[task_id]),
                'end': solver.Value(task_ends[task_id])
            }
            result['assignments'][task_id] = {m_id: solver.Value(assign) for m_id, assign in info.items() if isinstance(assign, cp_model.IntVar) and solver.Value(assign) == 1}
        return result
    else:
        return None

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO) 
app.logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

@app.route('/health', methods=['GET'])
def test():
    return jsonify({'status': 'Healthy'})

@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.json
    tasks = data['tasks']
    people = {int(i['id']): {'name': i['name'], 'type': i['type'], 'available_hours': i['available_hours']} for i in data['people']}
    unavailable_periods = []

    app.logger.info(f"Tasks: {tasks}")
    app.logger.info(f"people: {people}")
    #app.logger.info(f"Unavailable periods: {unavailable_periods}")

    unavailable_periods = [
    ]

    try:
        result = solve_scheduling(tasks, people, unavailable_periods)
        if result:
            app.logger.info(result)
            return jsonify(result)
        else:
            return jsonify({'error': 'No solution could be found.'}), 404
    except Exception as e:
        app.logger.error(e)
        return jsonify({'error': 'An error occurred while solving the problem.'}), 500



if __name__ == '__main__':
    app.run(debug=True)
    app.logger.info("Server started")