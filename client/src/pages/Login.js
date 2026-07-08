import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faGithub
} from "@fortawesome/free-brands-svg-icons";
import {
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {

  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const github = () => {
    window.open("http://localhost:5000/auth/github", "_self");
  };

  return (

    <div
      className="loginPage"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,.65),rgba(15,23,42,.65)),url('/img/img5.png')"
      }}
    >

      <div className="login">

        <FontAwesomeIcon
          icon={faShieldHalved}
          className="shieldIcon"
        />

        <h1 className="loginTitle">

          Welcome Back

        </h1>

        <p className="loginSubtitle">

          Continue securely using your favorite provider.

        </p>

        <button
          className="oauthBtn googleBtn"
          onClick={google}
        >

          <FontAwesomeIcon icon={faGoogle} />

          Continue with Google

        </button>

        <button
          className="oauthBtn githubBtn"
          onClick={github}
        >

          <FontAwesomeIcon icon={faGithub} />

          Continue with GitHub

        </button>

        <div className="loginFooter">

          OAuth 2.0 • PassportJS • React

        </div>

      </div>

    </div>

  );

};

export default Login;