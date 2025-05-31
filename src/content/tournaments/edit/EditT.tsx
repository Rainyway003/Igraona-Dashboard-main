import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import MultiDayEdit from "./MultiDayEdit";
import OneDayEdit from "./OneDayEdit";

const EditTournament = () => {
    const { formProps, saveButtonProps, query, formLoading } = useForm();

    const tournament = query?.data?.data;

    return (
        <div className="h-screen w-screen bg-[#f0f2f5]">
            <div className="h-full">
                <Edit
                    isLoading={formLoading}
                    breadcrumb={false}
                    saveButtonProps={saveButtonProps}

                >
                    <Form
                        {...formProps}
                        layout="vertical"
                    >
                        {tournament?.typeOfT === "MultiDay" ? <MultiDayEdit /> : <OneDayEdit />}
                    </Form>
                </Edit>
            </div>
        </div>
    );
};

export default EditTournament