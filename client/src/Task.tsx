import React from 'react';

interface TaskProps {
  time: string; // Time the task should be completed by
  details: string; // Details of the task
  materials: string; // Materials required
  location: string; // Location of the task
  notes: string; // Additional notes
  patient: string; // Patient the task is for
}

const Task: React.FC<TaskProps> = ({
  time,
  details,
  materials,
  location,
  notes,
  patient,
}) => {
  return (
    <div>
      <p>
        <strong>Patient:</strong> {patient}
      </p>
      <p>
        <strong>Time:</strong> {time}
      </p>
      <p>
        <strong>Details:</strong> {details}
      </p>
      <p>
        <strong>Equipment/materials:</strong> {materials}
      </p>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Notes:</strong> {notes}
      </p>
    </div>
  );
};

export default Task;
