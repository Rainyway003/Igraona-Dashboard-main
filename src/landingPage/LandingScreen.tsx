import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import ComputerIcon from '@mui/icons-material/Computer';
import GamesIcon from '@mui/icons-material/Games';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import topLeft from './assets/topLeft.png';
import Pozadina from './assets/10i.png'
import Video from './assets/web.mp4'
import {useNavigate} from 'react-router';
import './index.css'
import LandingCountBox from './components/landing/LandingCountBox';
import GoogleMap from './components/maps/GoogleMap';
import FooterLink from './components/landing/FooterLink';

function LandingScreen() {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/t')
  }

  return (
    <div className="w-screen h-svh russo">
      <div className="igraona h-full md:h-[110vh] w-full bg-[#161616] relative bg-cover bg-no-repeat" style={{
        backgroundImage: `url(${Pozadina})`,
        backgroundPosition: "calc(50%) center",
      }}>
        <div className="w-full h-full flex flex-col justify-center items-center text-centers russo">
          <h1 className="text-[#8D151F] text-center text-6xl md:text-8xl font-[1000] uppercase">Igraona Igraona</h1>
          <h2 className="text-white text-center text-6xl md:text-8xl font-[1000] uppercase">Turnir Turnira 4</h2>
          <button type="button" className="button mt-4" onClick={handleNavigate}>
            <div className="img-back"></div>
            <div className="text uppercase">Prijavi se</div>
          </button>
        </div>
      </div>


      <p className='block md:hidden text-white text-2xl p-4 mb-32'>
        <span className="text-[#8D151F]">Igraona Igraona</span> u Gornjem Vakuf - Uskoplju omiljeno je mjesto za gejmere
        svih generacija koji traže vrhunsku zabavu i odlično društvo. Uz širok izbor video igara, posjetitelji mogu
        testirati
        svoje vještine, takmičiti se na turnirima ili jednostavno uživati u igri s prijateljima u opuštenoj atmosferi.
        Bilo da
        dolazite sami ili s ekipom, očekuje vas puno smijeha, uzbuđenja i prilika za stvaranje nezaboravnih uspomena.
      </p>

      <div
        className="hidden md:flex w-[140%] h-[120%] relative justify-center items-center bg-[#161616] overflow-hidden transform rotate-[-3deg] origin-bottom-left">
        <video
          src={Video}

          loop
          muted
          autoPlay
          playsInline
          className="absolute w-full h-[140%] object-cover z-0 mask-video transform translate-x-[-15%] translate-y-[-10%]"
        />
        <p
          className='absolute w-[40%] left-24 bottom-48 text-white transform rotate-[3deg] text-3xl bg-black bg-opacity-50 p-4'>
          <span className="text-[#8D151F]">Igraona Igraona</span> u Gornjem Vakuf - Uskoplju omiljeno je mjesto za
          gejmere
          svih generacija koji traže vrhunsku zabavu i odlično društvo. Uz širok izbor video igara, posjetitelji mogu
          testirati
          svoje vještine, takmičiti se na turnirima ili jednostavno uživati u igri s prijateljima u opuštenoj atmosferi.
          Bilo da
          dolazite sami ili s ekipom, očekuje vas puno smijeha, uzbuđenja i prilika za stvaranje nezaboravnih uspomena.
        </p>
      </div>


      <div className={'block md:hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
          <LandingCountBox
            Icon={ComputerIcon}
            title={'Kompovi'}
            number={'24'}
            description={'300+ FPSa'}
          />
          <LandingCountBox
            Icon={SportsEsportsIcon}
            title={'Plejke'}
            number={'5'}
            description={'PS5 + VR2'}
          />
          <LandingCountBox
            Icon={GamesIcon}
            title={'Igre'}
            number={'50+'}
            description={'Za svakog po nešto'}
          />
          <LandingCountBox
            Icon={FastfoodIcon}
            title={'Pića'}
            number={'20+'}
            description={'Sokova i hurmaja'}
          />
        </div>
      </div>
      <div
        className="hidden md:flex bg-black w-[120%] image2-gradient h-[75vh] border-gradient justify-center items-center relative bottom-28 z-10 transform rotate-[-3deg] origin-top -left-[10%]">
        <div className="transform rotate-[3deg]">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
            <LandingCountBox
              Icon={ComputerIcon}
              title={'Kompovi'}
              number={'24'}
              description={'300+ FPSa'}
            />
            <LandingCountBox
              Icon={SportsEsportsIcon}
              title={'Plejke'}
              number={'5'}
              description={'PS5 + VR2'}
            />
            <LandingCountBox
              Icon={GamesIcon}
              title={'Igre'}
              number={'50+'}
              description={'Za svakog po nešto'}
            />
            <LandingCountBox
              Icon={FastfoodIcon}
              title={'Pića'}
              number={'20+'}
              description={'Sokova i hurmaja'}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full h-full image-gradient relative md:bottom-40"/>

      <div className="hidden md:flex w-full h-fit items-center justify-center background-gradient mb-40">
        <div className='w-full md:w-[80%]'>
          <GoogleMap/>
        </div>
      </div>

      <div
        className="image3-gradient w-full md:h-[320px] grid grid-cols-1 md:grid-cols-3 items-start p-8 md:px-32 md:py-16 gap-8 md:gap-32 text-white">
        {/*<div className={'flex justify-center items-center'}>*/}
        {/*<div className={'bg-black bg-opacity-90 w-fit h-fit p-8 rounded-3xl'}>*/}
        {/*  <img src={Logo} alt={'Logo'} width={300} height={300}/>*/}
        {/*</div>*/}
        {/*</div>*/}
        <div className={'flex flex-col gap-2 justify-center items-start'}>
          <h3 className='text-3xl'>Igraona Igraona</h3>
          <p className='text-2xl'>Vrbaska bb,<br/>Gornji Vakuf - Uskoplje,<br/>70240</p>
        </div>
        <div className={'flex flex-col gap-2 text-xl justify-center items-start'}>
          <h3 className='text-2xl'>Kontakti</h3>
          <FooterLink
            Icon={<CallIcon className={'!w-8 !h-8'}/>}
            text={'+387 61 831 802'}
            url={'tel:+38761831802'}
          />
          <FooterLink
            Icon={<EmailIcon className={'!w-8 !h-8'}/>}
            text={'igraona@p23.io'}
            url={'mailto:igraona@p23.io'}
          />
        </div>
        <div className={'flex flex-col gap-2 text-xl justify-center items-start text-white'}>
          <h3 className='text-2xl'>Linkovi</h3>
          <FooterLink
            Icon={<FacebookIcon className={'!w-8 !h-8'}/>}
            text={'Fejs'}
            url={'https://www.facebook.com/igraona.gvu'}
          />
          <FooterLink
            Icon={<InstagramIcon className={'!w-8 !h-8'}/>}
            text={'Instać'}
            url={'https://www.instagram.com/igraona.gvu'}
          />
          <FooterLink
            Icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"
                   className='bi bi-twitch'>
                <path
                  d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"/>
                <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z"/>
              </svg>
            }
            text={'Tvić'}
            url={'https://www.twitch.tv/igraona'}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingScreen