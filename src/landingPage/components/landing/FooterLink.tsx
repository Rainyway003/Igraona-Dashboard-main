import {Link} from "react-router";

const FooterLink = ({
  Icon,
  text,
  url,
}) => {
  return (
    <Link className={'flex gap-2 items-center'} to={url} target='_blank' rel='noopener noreferrer'>
      {Icon}
      <div className={'text-2xl'}>{text}</div>
    </Link>
  );
}

export default FooterLink;