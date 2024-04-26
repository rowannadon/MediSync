from ortools.sat.python import cp_model
from flask import Flask, request, jsonify
from ortools.sat.python import cp_model
import logging

def solve_scheduling(tasks, people, unavailable_periods):
    model = cp_model.CpModel()

    # Adjusting the person available hours to span multiple days
    min_start_time = 0
    max_end_time = 600000

    # Task variables
    task_starts = {}
    task_ends = {}
    intervals = {}

    for i, task in enumerate(tasks):
        duration = task['duration']
        suffix = f"_{i}"

        start_var = model.NewIntVar(min_start_time, max_end_time, 'start' + suffix)
        end_var = model.NewIntVar(min_start_time, max_end_time, 'end' + suffix)
        interval_var = model.NewIntervalVar(start_var, duration, end_var, 'interval' + suffix)

        task_starts[task['name']] = start_var
        task_ends[task['name']] = end_var
        intervals[task['name']] = interval_var

        # Add constraints to avoid unavailable periods
        for start, end in unavailable_periods:
            outside_before = model.NewBoolVar(f'outside_before_{task["name"]}_{start}')
            outside_after = model.NewBoolVar(f'outside_after_{task["name"]}_{end}')
            
            # Define conditions for the task to be outside the unavailable period
            model.Add(start_var + duration <= start).OnlyEnforceIf(outside_before)
            model.Add(start_var >= end).OnlyEnforceIf(outside_after)

            # Ensure that at least one of these conditions is true
            model.AddBoolOr([outside_before, outside_after])

    # Task dependencies
    for task in tasks:
        for subsequent_task_name in task['next']:
            model.Add(task_ends[task['name']] <= task_starts[subsequent_task_name])

        # person usage tracking
    person_tasks = {m_id: [] for m_id in people}

    for task in tasks:
        for req in task['required_people']:
            if 'id' in req:
                # Specific person by ID
                person_tasks[req['id']].append(intervals[task['name']])
            elif 'type' in req:
                # Any person of a specific type, create a temporary list for possible person IDs
                possible_people = [m_id for m_id, m in people.items() if m['type'] == req['type']]
                bvars = []
                for m_id in possible_people:
                    bvar = model.NewBoolVar(f'use_{m_id}_{task["name"]}')
                    bvars.append(bvar)
                    # Enforcing availability hours per person
                    # model.Add(intervals[task['name']].StartExpr() >= people[m_id]['available_hours'][0]).OnlyEnforceIf(bvar)
                    # model.Add(intervals[task['name']].EndExpr() <= people[m_id]['available_hours'][1]).OnlyEnforceIf(bvar)
                    # person_tasks[m_id].append(intervals[task['name']])
                # Require that exactly `req['count']` people of the specified type are used
                model.Add(sum(bvars) == req['count'])

    max_end_time = model.NewIntVar(0, max_end_time, 'max_end_time')

    for task_name, end_var in task_ends.items():
        model.Add(max_end_time >= end_var)

    # Ensure people are not double-booked
    for m_id, intervals in person_tasks.items():
        model.AddNoOverlap(intervals)

    model.Minimize(max_end_time)

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL:
        result = {task['name']: {'start': solver.Value(start), 'end': solver.Value(end)} for task, start, end in zip(tasks, task_starts.values(), task_ends.values())}
        return result
    else:
        return None

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO) 
app.logger.setLevel(logging.INFO)  # or app.logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setLevel(logging.INFO)  # or handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

@app.route('/health', methods=['GET'])
def test():
    return jsonify({'status': 'Healthy'})

@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.json
    tasks = data['tasks']
    people = {int(i['id']): {'type': i['type'], 'available_hours': i['available_hours']} for i in data['people']}
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