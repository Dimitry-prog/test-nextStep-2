import { IconType } from "react-icons";

type AuthSocialProps = {
  icon: IconType
  onClick: () => void
}

const AuthSocial = ({ icon: Icon, onClick }: AuthSocialProps) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='w-full px-4 py-2 flex items-center justify-center ring-1 ring-inset ring-gray-200 rounded shadow hover:bg-gray-100'
    >
      <Icon/>
    </button>
  );
};

export default AuthSocial;