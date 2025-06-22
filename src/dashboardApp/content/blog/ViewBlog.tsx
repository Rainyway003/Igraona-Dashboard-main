import React from 'react';
import {Input, Layout, theme, Typography} from "antd";
import {useNavigate, useOutletContext, useParams} from "react-router";
import {useOne} from "@refinedev/core";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

const {Content} = Layout;
const {Title} = Typography;

const ViewBlog = () => {
  const navigate = useNavigate();
  const {id} = useParams();

    const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

    React.useEffect(() => {
        setHeaderActions(
            <div className="flex justify-between w-full">
                <CreateButton
                    type="primary"
                    className="antbutton"
                    onClick={() => navigate('/blog')}
                    icon={<ArrowLeftOutlined/>}
                >
                    Back
                </CreateButton>
            </div>
        );
    }, [navigate, setHeaderActions ]);

  const {data, isLoading} = useOne({
    resource: "blog",
    id: id || "",
  });


  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <>
          <Title level={2}>{data?.data.title}</Title>
          <div dangerouslySetInnerHTML={{__html: data?.data.blog}}/>
    </>
  );
};

export default ViewBlog;