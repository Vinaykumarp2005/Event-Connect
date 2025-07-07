import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Route,Routes} from 'react-router-dom'
import RootLayout from './RootLayout'
import LandingPage from './components/common/LandingPage'
import SignUp from './components/common/SignUp'
import SignIn from './components/common/SignIn.jsx'
import EnrolledEvents from './components/students/EnrolledEvents'
import StudentDashBoard from './components/students/studentDashBoard.jsx'
import EventsById from './components/common/EventsById.jsx'
import OrganizerDashBoard from './components/organizer/OrganizerDashBoard.jsx'
import AdminDashBoard from './components/admin/AdminDashBoard.jsx'
import ManageEvents from './components/admin/ManageEvents.jsx'
import Events from './components/common/Events.jsx';
import VerifyPage from './components/common/VerifyPage.jsx'
import OrganizerHomePage from './components/organizer/OrganizerHomePage.js'
import CreatedEvents from './components/organizer/CreatedEvents.jsx'
import PostEvent from './components/organizer/PostEvent.jsx'
import {RecoilRoot} from 'recoil'
function Main(){
return (
  <BrowserRouter>
 <Routes>
    
    <Route path='/' element={<RootLayout/>}>
    <Route index element={<LandingPage/>}/>
    <Route path='signup' element={<SignUp/>}/>
    <Route path='signin' element={<SignIn/>}/>
     <Route path='verifyPage/:role/:id/:token' element={<VerifyPage/>}/>
    <Route path='student-profile/:emailId'>
      <Route path='dashboard' element={<StudentDashBoard/>}/>
      <Route path='enrolledevents' element={<EnrolledEvents/>}/>
      <Route path=':eventById' element={<EventsById/>}/>
      <Route path='events' element={<Events/>}/>
    </Route>
    <Route path='organizer-profile/:emailId' element={<OrganizerHomePage/>}>
    <Route index  element={<OrganizerDashBoard/>}/>
      <Route  path='dashboard' element={<OrganizerDashBoard/>}/>
      <Route path=':eventById' element={<EventsById/>}/>
      <Route path='events' element={<Events/>}/>
      <Route path='createdEvents' element={<CreatedEvents/>}/>
      <Route path='postEvents' element={<PostEvent/>}/>
    </Route>
    <Route path='admin-profile/:emailId'>
      <Route path='dashboard' element={<AdminDashBoard/>} />
        <Route path='manageEvents' element={<ManageEvents/>}/>
      <Route path=':eventById' element={<EventsById/>}/>
      <Route path='events' element={<Events/>}/>
    </Route>
    </Route>
  </Routes>
  </BrowserRouter>
)
}




createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <Main/>
  </RecoilRoot>
)
