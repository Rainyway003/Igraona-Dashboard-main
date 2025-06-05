import { useState } from "react";
import { useCreate } from '@refinedev/core';
import { Form } from 'antd';
import Pozadina from '../../assets/10i.png';
import '../../../App.css';
import '../../index.css';
import { CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormInput from '../forms/FormInput';
import CalendarComponent from '../Calendar';
import { ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

function Playstation() {
  const { mutate, isLoading: loading } = useCreate();

  const [rules, setRules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [form] = Form.useForm();

  const generateUniqueId = (date: Dayjs) => {
    return `res-${date.format('YYYYMMDD')}`;
  };

  const onFinish = async (values: { name: string; number: string }) => {
    if (selectedDates.length === 0) {
      setError('Molimo odaberite barem jedan datum');
      return;
    }

    try {
      const sortedDates = [...selectedDates].sort((a, b) => a.diff(b));

      await Promise.all(
        sortedDates.map(async (date) => {
          const newId = generateUniqueId(date);
          await mutate({
            resource: 'reserve',
            values: {
              id: newId,
              name: values.name,
              number: values.number,
              vrijeme: date.startOf('day').toDate(),
              accepted: true,
            },
          });
        })
      );

      form.resetFields();
      setSelectedDates([]);
      setError(null);
      setComplete('Uspješno!');
    } catch (err) {
      setError('Došlo je do greške prilikom rezervacije');
    }
  };

  return (
    <>
      <div className="w-screen bg-red-200 overflow-x-hidden h-screen russo">
        <div
          className="igraona h-full md:h-[110vh] w-full bg-[#161616] relative bg-cover bg-no-repeat flex justify-center items-center"
          style={{
            backgroundImage: `url(${Pozadina})`,
            backgroundPosition: "calc(50%) center",
          }}>
          <div className={'flex flex-col items-center justify-center'}>
            <h1 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] uppercase mb-2'>Rezerviraj Plejku</h1>
            <button className='text-2xl md:text-4xl mb-8 underline text-white' onClick={() => setRules(true)}>Pravila</button>
            {error && <p className='w-screen px-4 text-2xl text-amber-300 mb-4 text-center'>{error}</p>}

            <Form form={form} className='flex flex-col items-center w-[50%] gap-3' onFinish={onFinish}>
              <div className='mt-40'>A</div>
              <FormInput placeholder={'Ime i Prezime'} name={'name'} type={'text'} required={true} />
              <FormInput placeholder={'Kontakt'} name={'number'} type={'number'} required={true} />

              <ConfigProvider
                theme={{
                  token: {
                    colorBgBase: '#000000',
                    colorBgContainer: '#2a2929',
                    colorPrimary: '#8D151F',
                    controlItemBgActive: '#000000',
                    colorText: '#ffffff',
                    colorBgTextActive: '#ffffff',
                    colorBgDisabled: '#ffffff',
                    colorTextDisabled: '#605e5e',
                    textsecondary: '#ffffff',
                  },
                  components: {
                    Calendar: {
                      fullBg: '#000000', fullPanelBg: '#2a2929'
                    }
                  }
                }}
              >
                <CalendarComponent
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                />
              </ConfigProvider>

              <button type="submit" className="button sm:!w-[300px] sm:!h-[75px] max-sm:!w-[200px] max-sm:!h-[50px]">
                <div className="img-back !w-full !h-full"></div>
                <div className="text max-sm:!text-xs russo">PRIJAVI SE</div>
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* Modal loading i complete */}
      {loading && (
        <div className='fixed top-0 left-0 w-screen h-svh z-50 bg-black flex flex-col justify-center items-center'>
          <CircularProgress className='!text-[#8D151F] !h-12 !w-12 md:!h-24 md:!w-24' />
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] mt-8 text-center'>Rezervirate Plejku...</h4>
        </div>
      )}
      {complete && (
        <div className='fixed top-0 left-0 w-screen h-svh z-50 bg-black flex flex-col justify-center items-center'>
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] text-center mb-4'>{complete}</h4>
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] text-center mb-8'>Rezervirali ste Plejku</h4>
          <h4 className='text-2xl md:text-4xl text-white text-center'>Očekujte poziv za potvrdu.</h4>
          <IconButton className='!mt-8' onClick={() => setComplete(null)}>
            <CloseIcon className='!text-white' />
          </IconButton>
        </div>
      )}
    </>
  );
}

export default Playstation;
