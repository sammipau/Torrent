import "./Navbar.css";

const Navbar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="topBar">
          <a className="navbar-brand">Torrent Site</a>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/all">All</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tags">Tags</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/categories">Categories</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/projection">Projection</a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/stats">Stats</a>
            </li>
          </ul>
          <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul class="navbar-nav ms-auto right-pad">
                <a className="nav-link" href="/user">Manage User</a>
            </ul>
          </div>
        </div>
      </nav>
    )
}

export default Navbar