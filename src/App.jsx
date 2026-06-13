import Header from './components/layout/Header.jsx';
import StepIndicator from './components/layout/StepIndicator.jsx';
import QueryInput from './components/steps/QueryInput.jsx';
import ResearchPanel from './components/steps/ResearchPanel.jsx';
import RoutingConfirm from './components/steps/RoutingConfirm.jsx';
import RTIDraft from './components/steps/RTIDraft.jsx';
import SubmissionGuide from './components/steps/SubmissionGuide.jsx';
import { useWizard } from './hooks/useWizard.js';

export default function App() {
  const { state, goToStep, updateState, resetWizard } = useWizard();

  return (
    <div className="min-h-screen bg-gradient-to-b from-nizam_green-50 to-background">
      <Header />
      <StepIndicator currentStep={state.step} />

      <main>
        {state.step === 1 && (
          <QueryInput
            onSubmit={(query) => {
              updateState({ query });
              goToStep(2);
            }}
          />
        )}

        {state.step === 2 && (
          <ResearchPanel
            query={state.query}
            onResearchDone={(data) => updateState(data)}
            onProceed={() => goToStep(3)}
            onRevise={() => goToStep(1)}
          />
        )}

        {state.step === 3 && (
          <RoutingConfirm
            query={state.query}
            researchSummary={state.researchSummary}
            onConfirm={({ department, routingReason }) => {
              updateState({ department, routingReason });
              goToStep(4);
            }}
            onBack={() => goToStep(2)}
          />
        )}

        {state.step === 4 && (
          <RTIDraft
            query={state.query}
            researchSummary={state.researchSummary}
            department={state.department}
            routingReason={state.routingReason}
            onDraftDone={(data) => updateState(data)}
            onBack={() => goToStep(3)}
            onNext={() => {
              updateState({ filedDate: new Date().toISOString() });
              goToStep(5);
            }}
          />
        )}

        {state.step === 5 && (
          <SubmissionGuide
            department={state.department}
            filedDate={state.filedDate}
            onReset={resetWizard}
          />
        )}
      </main>
    </div>
  );
}
