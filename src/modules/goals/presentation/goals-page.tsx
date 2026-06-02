import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { UserGoals } from "#/modules/goals/domain/entities/goal";
import { CreateGoalForm } from "#/modules/goals/presentation/components/create-goal-form";
import { GoalCard } from "#/modules/goals/presentation/components/goal-card";
import { groupGoalLinkedResourcesByGoalId } from "#/modules/goals/presentation/group-goal-linked-resources";
import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

type GoalsPageProps = {
  goals: UserGoals;
  library: PersonalLibrary;
  linkedResources: GoalLinkedResource[];
};

export function GoalsPage({ goals, library, linkedResources }: GoalsPageProps) {
  const linkedByGoalId = groupGoalLinkedResourcesByGoalId(linkedResources);
  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <p className="island-kicker mb-2">Learning goals</p>
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          Your objectives
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Define what you want to learn and how much time you can commit each week.
        </p>
      </header>

      <CreateGoalForm />

      <section className="mt-10" aria-labelledby="goals-list-heading">
        <h2
          id="goals-list-heading"
          className="display-title mb-4 text-2xl font-bold text-[var(--text-primary)]"
        >
          Your goals
        </h2>

        {goals.goals.length === 0 ? (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] py-8 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="display-title text-xl">No goals yet</CardTitle>
              <CardDescription>
                Create your first learning goal above to start tracking your objectives.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {goals.goals.map((goal) => (
              <li key={goal.id} className="rise-in">
                <GoalCard
                  goal={goal}
                  linkedResources={linkedByGoalId.get(goal.id) ?? []}
                  libraryItems={library.items}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
