import React from 'react';
import {Typography} from "antd";
import {useNavigate, useOutletContext, useParams} from "react-router";
import {useOne} from "@refinedev/core";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

const {Title} = Typography;

const ViewRule = () => {
  const navigate = useNavigate();
  const {id} = useParams();

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <CreateButton
          type="primary"
          className="antbutton"
          onClick={() => navigate('/rules')}
          icon={<ArrowLeftOutlined/>}
        >
          Nazad
        </CreateButton>
      </div>
    );
  }, [navigate, setHeaderActions]);

  const {data, isLoading} = useOne({
    resource: "rules",
    id: id || "",
  });


  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <>
      <Title level={2}>{data?.data.name}</Title>
      <div dangerouslySetInnerHTML={{__html: data?.data.rule}}/>
    </>
  );
};

export default ViewRule;