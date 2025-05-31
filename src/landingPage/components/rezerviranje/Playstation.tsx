import {useParams} from 'react-router';
import Pozadina from '../../assets/10i.png';
import '../../index.css';
import {useState} from "react";
import {CircularProgress, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Form} from 'antd';
import {useCreate, useOne} from '@refinedev/core';
import '../../../App.css'
import FormInput from '../forms/FormInput';
import CalendarComponent from '../../../dashboardApp/components/Calendar';

function Playstation() {
  const {id} = useParams()
  const {mutate, isLoading: loading} = useCreate()

  const [rules, setRules] = useState(false);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const onFinish = (values: { name: string; number: string }) => {
    if (!dateRange) {
      setError('Molimo odaberite period rezervacije');
      return;
    }
    setError(null);

    mutate({
      resource: 'reserve',
      values: {
        name: values.name,
        number: values.number,
        startingAt: new Date(dateRange.start),
        endingAt: new Date(dateRange.end),
        accepted: true,
      },
    });
    setComplete(true);
  };

  return (
    <>
      <div className="w-screen h-svh bg-red-200 overflow-hidden russo">
        <div
          className="igraona h-full md:h-[110vh] w-full bg-[#161616] relative bg-cover bg-no-repeat flex justify-center items-center"
          style={{
            backgroundImage: `url(${Pozadina})`,
            backgroundPosition: "calc(50%) center",
          }}>
          <div className={'flex flex-col items-center justify-center'}>
            <h1 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] uppercase mb-2'>Rezerviraj Plejku</h1>
            <button className='text-2xl md:text-4xl mb-8 underline text-white ' onClick={() => setRules(true)}>Pravila
            </button>
            {error && <p className={'w-screen px-4 text-2xl text-amber-300 mb-4 break-words text-center'}>{error}</p>}
            <Form method="post" className='flex flex-col items-center w-[50%] gap-3' onFinish={onFinish}>
              <FormInput placeholder={'Ime i Prezime'} name={'name'} type={'text'} required={true}/>
              <FormInput placeholder={'Kontakt'} name={'number'} type={'number'} required={true}/>
              <CalendarComponent onDateSelect={setDateRange}/>
              <button type="submit"
                      className="button sm:!w-[300px] sm:!h-[75px] max-sm:!w-[200px] max-sm:!h-[50px] mt-8">
                <div className="img-back !w-full !h-full"></div>
                <div className="text max-sm:!text-xs russo">PRIJAVI SE</div>
              </button>
            </Form>
          </div>
        </div>
      </div>
      {rules && (
        <div className={'fixed top-0 left-0 w-screen h-svh md:p-32 z-40 roboto'}>
          <div
            className={'bg-black w-full h-full bg-opacity-90 md:rounded-3xl p-4 md:px-32 md:py-16 flex flex-col overflow-y-auto'}>
            <IconButton className={'!ml-auto'} onClick={() => setRules(false)}>
              <CloseIcon className={'!text-white'}/>
            </IconButton>
            <h1 className="text-3xl font-extrabold text-center text-[#8D151F] mb-4">Pravila turnira</h1>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#8D151F]">Format takmičenja</h2>
              <ul className="md:text-xl list-disc list-inside text-white mt-2">
                <li>Turnir se sastoji od <strong>online kvalifikacija</strong>, <strong>lokalnog
                  mini-turnira</strong> i <strong>LAN završnice</strong>.
                </li>
                <li>Online kvalifikacije se igraju preko <strong>Faceit</strong> platforme u <strong>Swiss
                  formatu</strong>.
                </li>
                <li>Lokalni mini-turnir se igra dan prije LAN završnice i učestvuju ekipe iz Gornjeg Vakuf - Uskoplja.
                </li>
                <li>Tri najbolje ekipe iz online kvalifikacija + jedna lokalna prolaze u LAN završnicu.</li>
                <li><strong>Vrijeme igranja online mečeva je fleksibilno</strong>, a timovi se međusobno dogovaraju oko
                  termina u zadanim rokovima.
                </li>
                <li>Ako se timovi ne mogu dogovoriti oko vremena i dana igranja, organizatori će im dodijeliti termin.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#8D151F]">Prijava</h2>
              <ul className="md:text-xl list-disc list-inside text-white mt-2">
                <li>Prijave su otvorene do <strong>16.03. 00:00</strong>.</li>
                <li><strong>Prijava je besplatna</strong> i otvorena za sve.</li>
                <li>Svaka ekipa mora imati <strong>5 Faceit igrača</strong> i dostaviti <strong>kontakt
                  telefon</strong> za prijavu.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#8D151F]">Nagrade</h2>
              <ul className="md:text-xl list-disc list-inside text-white mt-2">
                <li>1. misto <strong>1000 KM</strong></li>
                <li>2. misto <strong>200 KM</strong></li>
                <li>3. misto <strong>100 KM</strong></li>
                <li>igrač turnira <strong>100 KM</strong></li>
                <li>potez turnira <strong>100 KM</strong></li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#8D151F]">Vremenski okvir</h2>
              <ul className="md:text-xl list-disc list-inside text-white mt-2">
                <li><strong>Online kvalifikacije</strong>: Od <strong>17.03.</strong> do <strong>04.04.</strong></li>
                <li><strong>Lokalni mini-turnir</strong>: Subota, <strong>05.04.</strong></li>
                <li><strong>LAN završnica</strong>: Nedilja, <strong>06.04.</strong></li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#8D151F]">Dodatne napomene</h2>
              <ul className="md:text-xl list-disc list-inside text-white mt-2">
                <li>Svi mečevi online kvalifikacija igraju se prema pravilima Faceit platforme.</li>
                <li>Detalji o LAN završnici bit će objavljeni nakon završetka kvalifikacija.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div
          className={'fixed top-0 left-0 w-screen h-svh px-4 z-50 bg-black flex flex-col justify-center items-center'}>
          <CircularProgress className={'!text-[#8D151F] !h-12 !w-12 md:!h-24 md:!w-24'}/>
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F]  mt-8 text-center'>Rezervirate Plejku...</h4>
        </div>
      )}
      {complete && (
        <div
          className={'fixed top-0 left-0 w-screen h-svh px-4 z-50 bg-black flex flex-col justify-center items-center'}>
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] text-center mb-4'>{complete}</h4>
          <h4 className='text-4xl md:text-6xl font-[1000] text-[#8D151F] text-center mb-8'>Rezervirali ste Plejku</h4>
          <h4 className='text-2xl md:text-4xl text-white  text-center'>Očekujte telefonski poziv potvrde na broj koji
            ste unijeli.</h4>
          <IconButton className={'!mt-8'} onClick={() => setComplete(null)}>
            <CloseIcon className={'!text-white'}/>
          </IconButton>
        </div>
      )}
    </>
  )
}

export default Playstation;