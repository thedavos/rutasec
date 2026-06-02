import { createD1GoalsAdapter } from "#/modules/goals/adapters/d1/d1-goals-adapter";
import { createD1LibraryAdapter } from "#/modules/library/adapters/d1/d1-library-adapter";
import { GetPersonalLibraryUseCase } from "#/modules/library/application/get-personal-library/get-personal-library.use-case";
import { createD1StudyPlanAdapter } from "#/modules/timeline/adapters/d1/d1-study-plan-adapter";
import { BuildStudyPlanDraftUseCase } from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft.use-case";
import {
  GenerateStudyPlanForGoalUseCase,
  GetStudyPlanForGoalUseCase,
} from "#/modules/timeline/application";
import { getDb } from "#/shared/db";

export type TimelineModule = {
  generateStudyPlanForGoal: GenerateStudyPlanForGoalUseCase;
  getStudyPlanForGoal: GetStudyPlanForGoalUseCase;
};

export function createTimelineModule(db: D1Database): TimelineModule {
  const goals = createD1GoalsAdapter(db);
  const library = createD1LibraryAdapter(db);
  const studyPlans = createD1StudyPlanAdapter(db);

  return {
    generateStudyPlanForGoal: new GenerateStudyPlanForGoalUseCase(
      goals,
      new GetPersonalLibraryUseCase(library),
      new BuildStudyPlanDraftUseCase(),
      studyPlans,
    ),
    getStudyPlanForGoal: new GetStudyPlanForGoalUseCase(studyPlans),
  };
}

export function getTimelineModule(): TimelineModule {
  return createTimelineModule(getDb());
}
