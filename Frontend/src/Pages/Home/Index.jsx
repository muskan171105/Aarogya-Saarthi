import "./Index.css";

function Home() {
  return (
    <div className="login-page">
      <div id="whitebox">
        <div id="name">
          <h1>Aarogya Saarthi</h1>
          <p>Empowering healthcare with real-time solutions, secure data, and smarter decisions</p>
        </div>
        <div className="form-box">
          <h2 className="login-heading">Log In</h2>
          <form id="login" className="input-group">
            <input type="text" className="input-field" placeholder="User id" required />
            <input type="password" className="input-field" placeholder="Enter Password" required />
            <div className="checkbox-container">
              <input type="checkbox" className="check-box" id="remember" />
              <label htmlFor="remember">Remember Password</label>
            </div>
            <button type="submit" className="submit-btn">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
