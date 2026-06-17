import { useState } from 'react';
import Header from './components/layout/Header.jsx';
import TabNav from './components/layout/TabNav.jsx';
import StepIndicator from './components/layout/StepIndicator.jsx';
import BackgroundTexture from './components/layout/BackgroundTexture.jsx';
import QueryInput from './components/steps/QueryInput.jsx';
import ResearchPanel from './components/steps/ResearchPanel.jsx';
import RoutingConfirm from './components/steps/RoutingConfirm.jsx';
import RTIDraft from './components/steps/RTIDraft.jsx';
import SubmissionGuide from './components/steps/SubmissionGuide.jsx';
import RTIFeed from './components/tabs/RTIFeed.jsx';
import TrackRTI from './components/tabs/TrackRTI.jsx';
import { useWizard } from './hooks/useWizard.js';

export default function App() {
  const [activeTab, setActiveTab]     = useState('file');
  const [trackId,   setTrackId]       = useState('');
  const { state, goToStep, updateState, resetWizard } = useWizard();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilingComplete = (trackingId) => {
    setTrackId(trackingId);
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundTexture />
      <div className="relative z-10">
        <Header isDemo={state.isDemo} />
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'file' && (
          <StepIndicator currentStep={state.step} />
        )}

        <main>
          {activeTab === 'feed' && <RTIFeed />}

          {activeTab === 'track' && (
            <TrackRTI initialId={trackId} />
          )}

          {activeTab === 'file' && (
            <>
              {state.step === 1 && (
                <QueryInput
                  selectedParties={state.selectedParties}
                  onPartiesChange={(selectedParties) => updateState({ selectedParties })}
                  onSubmit={(query) => {
                    updateState({ query });
                    goToStep(2);
                  }}
                />
              )}

              {state.step === 2 && (
                <ResearchPanel
                  query={state.query}
                  selectedParties={state.selectedParties}
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
                  draftEn={state.draftEn}
                  subjectEn={state.subjectEn}
                  onReset={resetWizard}
                  onFilingComplete={(id) => {
                    handleFilingComplete(id);
                  }}
                  onGoToTrack={() => handleTabChange('track')}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
