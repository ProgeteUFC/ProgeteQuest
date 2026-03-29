import React from "react";
import { ListContainer, DisciplinaButton } from "./styles";

export interface Course {
  id: string;
  name: string;
}

interface CoursesListProps {
  courses: Course[];
  onSelect: (course: Course) => void;
  selectedId?: string;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, onSelect, selectedId }) => {
  return (
    <ListContainer>
      {courses.map((course) => (
        <DisciplinaButton
          key={course.id}
          onClick={() => onSelect(course)}
          selected={course.id === selectedId}
        >
          {course.name}
        </DisciplinaButton>
      ))}
    </ListContainer>
  );
};

export default CoursesList;
