import "../../style.css";
import SideBar from "../../SideBar";

function Dashboard() {
  return (
    <>
      <SideBar />

      <section className="home-section">
        <div className="home-content">
          <i className='bx bx-menu'></i>
        </div>
        <div className="welcome-message">
          <h1>
            <span>Welcome to</span>
            <span className="highlight">Aarogya Saarthi</span>
          </h1>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
