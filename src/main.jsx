import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/* No StrictMode: its double mount leaves orphaned ScrollTrigger pin-spacers,
   which nests the pinned sections and breaks the scroll math in dev. */
createRoot(document.getElementById('root')).render(<App />);
