import React from 'react';
import {useOutletContext, useNavigate} from "react-router";

const Home: React.FC = () => {
const navigate = useNavigate()
    const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

    React.useEffect(() => {
        setHeaderActions(
            <div className="flex justify-between w-full">
            </div>
        );

        return () => setHeaderActions(null);
    }, [navigate]);

  return (
    <>
          Hello Admin!
    </>
  );
};

export default Home;
