import { InterviewerMatrixItemDto } from "./interviewer-matrix-item.dto";
import { InterviewerMatrixRoleOptionDto } from "./interviewer-matrix-role-option.dto";

export interface InterviewerMatrixBoardDto {
  workPositionRoles: InterviewerMatrixRoleOptionDto[];
  interviewerRoles: InterviewerMatrixRoleOptionDto[];
  rules: InterviewerMatrixItemDto[];
}
