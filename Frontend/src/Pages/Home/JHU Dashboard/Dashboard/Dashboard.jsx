import "../../style.css";
import SideBar from "../../SideBar";

function Dashboard() {
  return (
    <>
      <SideBar />

      <section className="home-section">
        <div className="Hello">
          <h1>
            <p>Welcome to <br/>Aarogya Saarthi</p>
          </h1>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
