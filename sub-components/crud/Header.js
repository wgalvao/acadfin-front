import Link from "next/link";

const Header = ({ title, addLink }) => (
  <div className="d-flex justify-content-between align-items-center">
    <div className="mb-2 mb-lg-0">
      <h3 className="mb-0 text-white">{title}</h3>
    </div>
    <div>
      <Link href={addLink} className="btn btn-white">
        Adicionar novo {title.toLowerCase()}
      </Link>
    </div>
  </div>
);

export default Header;
