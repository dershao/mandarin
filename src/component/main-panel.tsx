import '../css/header.css';
import '../css/panel.css';
import { AboutPanelButton } from './panel-button';

export const MainPanel: React.FC = () => {

  return (
    <>
      <div id="header">
        <div id='main-panel'>
          <AboutPanelButton />
        </div>
      </div>
    </>
  );
}
