import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import type {NotificationProvider} from "@refinedev/core";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {App as AntdApp, ConfigProvider} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {notification} from "antd";
import hrHR from "antd/es/locale/hr_HR";

import dataProvider from './dashboardApp/providers/data-provider'
import ShowTournaments from "./dashboardApp/content/tournaments/ShowTournaments";
import Home from "./dashboardApp/content/Home";
import CreateTournamentView from "./dashboardApp/content/tournaments/CreateTournamentView";
import EditTournament from "./dashboardApp/content/tournaments/EditTournamentView";
import {resources} from "./dashboardApp/config/resources";
import AppLayout from "./dashboardApp/components/AppLayout/AppLayout";
import ShowTeams from "./dashboardApp/content/teams/ShowTeams";
import Login from "./dashboardApp/content/login/Login";
import {authProvider} from "./dashboardApp/providers/auth-provider";
import LandingApp from "./landingPage/LandingApp"
import SignUpScreen from "./landingPage/landingTournaments/SignUpScreen";
import ShowTLanding from "./landingPage/landingTournaments/ShowTLanding";
import ShowPlayers from "./dashboardApp/content/players/ShowPlayers";
import ShowGames from "./dashboardApp/content/games/ShowGames";
import CreateGame from "./dashboardApp/content/games/CreateGame";
import ShowBanned from "./dashboardApp/content/banned/ShowBanned";
import CreateBan from "./dashboardApp/content/banned/CreateBan";
import Playstation from "./landingPage/components/rezerviranje/Playstation";
import ShowBlogs from "./dashboardApp/content/blog/ShowBlogs";
import CreateBlog from "./dashboardApp/content/blog/CreateBlog";
import ViewBlog from "./dashboardApp/content/blog/ViewBlog";
import ShowReserve from "./dashboardApp/content/reserve/ShowReserve";
import ShowRules from "./dashboardApp/content/rules/ShowRules";
import CreateRule from "./dashboardApp/content/rules/CreateRule";
import EditGame from "./dashboardApp/content/games/EditGame";
import EditRule from "./dashboardApp/content/rules/EditRule";
import EditBlog from "./dashboardApp/content/blog/EditBlog";
import ViewRule from "./dashboardApp/content/rules/ViewRule";
import SingleElimination from "./dashboardApp/content/generation/SingleElimination";
import ShowPlayMonths from "./dashboardApp/content/plays/ShowPlayMonths";
import ShowSubmissions from "./dashboardApp/content/plays/ShowSubmissions";
import DoubleElimination from "./dashboardApp/content/generation/DoubleElimination";

function App() {

  const customNotificationProvider: NotificationProvider = {
    open: ({message, description, type}) => {
      let translatedMessage = message;
      let translatedDescription = description;

      if (message === "Success") {
        translatedMessage = "Uspješno";
      }

      if (typeof description === "string") {
        if (description.includes("Successfully deleted a tournament")) {
          translatedDescription = "Turnir je uspješno izbrisan.";
        } else if (description.includes("Successfully updated")) {
          translatedDescription = "Podaci su uspješno ažurirani.";
        } else if (description.includes("Successfully created")) {
          translatedDescription = "Podaci su uspješno dodani.";
        } else if (description.includes("Successfully deleted")) {
          translatedDescription = "Podaci su uspješno izbrisani.";
        }
      }

      if (message === "Successfully deleted a participant") {
        return;
      }

      notification[type || "info"]({
        message: translatedMessage,
        description: translatedDescription,
      });
    },
    close: () => notification.destroy(),
  };


  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <ConfigProvider locale={hrHR}>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={customNotificationProvider}
              routerProvider={routerBindings}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "4cEHo1-TlgDsX-WcifnB",
              }}
            >
              <Routes>
                <Route index element={<LandingApp/>}/>
                <Route path="/t" element={<ShowTLanding/>}/>
                <Route path="/t/:id" element={<SignUpScreen/>}/>
                <Route path="/rezerviraj" element={<Playstation/>}/>
                <Route element={<Authenticated key="protected"
                                               fallback={<Login></Login>}><AppLayout/></Authenticated>}>
                  <Route path="/blog">
                    <Route index element={<ShowBlogs/>}/>
                    <Route path='new' element={<CreateBlog/>}/>
                    <Route path=':id' element={<ViewBlog/>}/>
                    <Route path='edit/:id' element={<EditBlog/>}/>
                  </Route>
                  <Route path="/tournaments">
                    <Route index element={<ShowTournaments/>}/>
                    <Route path="new" element={<CreateTournamentView/>}/>
                    <Route path="edit/:id" element={<EditTournament/>}/>
                    <Route path="generation/:id">
                      <Route path={'single'} element={<SingleElimination/>}/>
                      <Route path={'double'} element={<DoubleElimination/>}/>
                    </Route>
                  </Route>
                  <Route path="/tournaments/:id">
                    <Route index element={<ShowTeams/>}/>
                  </Route>
                  <Route path="/tournaments/:id/:name">
                    <Route index element={<ShowPlayers/>}/>
                  </Route>
                  <Route path="/dashboard" element={<Home/>}/>
                  <Route path="/games">
                    <Route index element={<ShowGames/>}/>
                    <Route path={'new'} element={<CreateGame/>}/>
                    <Route path={'edit/:id'} element={<EditGame/>}/>
                  </Route>
                  <Route path="/rules">
                    <Route index element={<ShowRules/>}/>
                    <Route path={'new'} element={<CreateRule/>}/>
                    <Route path={'edit/:id'} element={<EditRule/>}/>
                    <Route path={':id'} element={<ViewRule/>}/>
                  </Route>
                  <Route path="/banned">
                    <Route index element={<ShowBanned/>}/>
                    <Route path={'new'} element={<CreateBan/>}/>
                  </Route>
                  <Route path="/plejke">
                    <Route index element={<ShowReserve/>}/>
                  </Route>
                  <Route path='/plays'>
                    <Route index element={<ShowPlayMonths/>}/>
                    <Route path={":id"} element={<ShowSubmissions/>}/>
                  </Route>
                </Route>
              </Routes>
              <RefineKbar/>
              <UnsavedChangesNotifier/>
              <DocumentTitleHandler/>
            </Refine>
          </ConfigProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;