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
function Main(){
return (
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<RootLayout/>}>
    <Route index element={<LandingPage/>}/>
    <Route path='signup' element={<SignUp/>}/>
    <Route path='signin' element={<SignIn/>}/>
    <Route path='student-profile/:emailId'>
      <Route path='dashboard' element={<StudentDashBoard/>}/>
      <Route path='enrolledevents' element={<EnrolledEvents/>}/>
      <Route path=':eventById' element={<EventsById/>}/>
      <Route path='events' element={<Events/>}/>
    </Route>
    <Route path='organizer-profile/:emailId'>
      <Route path='dashboard' element={<OrganizerDashBoard/>}/>
      <Route path='enrolledevents' element={<EnrolledEvents/>}/>
      <Route path=':eventById' element={<EventsById/>}/>
      <Route path='events' element={<Events/>}/>
    </Route>
    <Route path='admin-profile/'>
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
  <StrictMode>
    <Main/>
  </StrictMode>,
)
