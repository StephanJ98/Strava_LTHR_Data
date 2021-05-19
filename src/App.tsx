import Header from './components/Header/header'
import DropDownBody from './components/DropDownBody'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <DropDownBody />
    </div>
  );
}

export default App;
