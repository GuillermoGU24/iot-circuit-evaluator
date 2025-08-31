import "./style/NotFound.css"

const Page404 = () => {
  return (
    <div id="skybox" className="skybox">
      <div className="txt">
        Game over
        <br />
        <span>404 Circuito No Encontrado</span>
      </div>
      <div id="player" className="idle"></div>
      <div className="ground"></div>
    </div>
  );
};

export default Page404;
