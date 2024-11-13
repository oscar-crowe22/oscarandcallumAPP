import './NavBar.css'

const Navbar = () => {
    return (
      <nav id="nav_bar">
        <h1 id="title">Drinking Hub</h1>
        <ul class="navbar_items">
          <li class="navbar_item">Home</li>
          <li class="navbar_item">About</li>
          <li class="navbar_item">Contact</li>
        </ul>
      </nav>
    );
};

export default Navbar