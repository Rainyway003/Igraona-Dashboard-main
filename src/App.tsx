import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {useNotificationProvider} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {App as AntdApp} from "antd";
import {BrowserRouter, Route, Routes} from "react-router";

import dataProvider from './dashboardApp/providers/data-provider'
import ShowTournaments from "./dashboardApp/content/tournaments/ShowTournaments";
import Home from "./dashboardApp/content/Home";
import CreateTournamentView from "./dashboardApp/content/tournaments/create/CreateTournamentView";
import EditTournament from "./dashboardApp/content/tournaments/edit/EditT";
import {resources} from "./dashboardApp/config/resources";
import AppLayout from "./dashboardApp/components/AppLayout/AppLayout";
import ShowTeams from "./dashboardApp/content/teams/ShowTeams";
import Login from "./dashboardApp/content/login/Login";
import {authProvider} from "./dashboardApp/providers/auth-provider";
import LandingApp from "./landingPage/LandingApp"
import SignUpScreen from "./landingPage/landingTournaments/SignUpScreen";
import ShowTLanding from "./landingPage/landingTournaments/ShowTLanding";
import ShowPlayers from "./dashboardApp/content/players/ShowPlayers";
import CreateTeam from "./dashboardApp/content/teams/create/CreateTeam";
import EditTeam from "./dashboardApp/content/teams/edit/EditTeam";
import ShowGames from "./dashboardApp/content/games/ShowGames";
import CreateGame from "./dashboardApp/content/games/create/CreateGame";
import ShowBanned from "./dashboardApp/content/banned/ShowBanned";
import CreateBan from "./dashboardApp/content/banned/create/CreateBan";
import Playstation from "./landingPage/components/rezerviranje/Playstation";
import ShowBlogs from "./dashboardApp/content/blog/ShowBlogs";
import CreateBlog from "./dashboardApp/content/blog/CreateBlog";
import ViewBlog from "./dashboardApp/content/blog/ViewBlog";
import ShowReserve from "./dashboardApp/content/reserve/ShowReserve";
import ShowRules from "./dashboardApp/content/rules/ShowRules";
import CreateRule from "./dashboardApp/content/rules/CreateRule";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
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
                </Route>
                <Route path="/tournaments">
                  <Route index element={<ShowTournaments/>}/>
                  <Route path="new" element={<CreateTournamentView/>}/>
                  <Route path="edit/:id" element={<EditTournament/>}/>
                </Route>
                <Route path="/tournaments/:id">
                  <Route index element={<ShowTeams/>}/>
                  <Route path="new" element={<CreateTeam/>}/>
                  <Route path="edit" element={<EditTeam/>}/>
                </Route>
                <Route path="/tournaments/:id/:name">
                  <Route index element={<ShowPlayers/>}/>
                </Route>
                <Route path="/dashboard" element={<Home/>}/>
                <Route path="/games">
                  <Route index element={<ShowGames/>}/>
                  <Route path={'new'} element={<CreateGame/>}/>
                </Route>
                <Route path="/rules">
                  <Route index element={<ShowRules/>}/>
                  <Route path={'new'} element={<CreateRule/>}/>
                </Route>
                <Route path="/banned">
                  <Route index element={<ShowBanned/>}/>
                  <Route path={'new'} element={<CreateBan/>}/>
                </Route>
                <Route path="/plejke">
                  <Route index element={<ShowReserve/>}/>
                </Route>
              </Route>
            </Routes>
            <RefineKbar/>
            <UnsavedChangesNotifier/>
            <DocumentTitleHandler/>
          </Refine>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;