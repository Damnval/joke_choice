import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Landing from './screens/guest/landing/Landing'
import Login from './screens/guest/login/Login'
import Logout from './screens/guest/logout/Logout'
import Dashboard from './screens/user/dashboard/Dashboard'
import JobOfferDetail from './screens/client/jobOfferDetail/JobOfferDetail'
import JobDetail from './screens/user/jobDetail/JobDetail'
import JobSearch from './screens/user/jobSearch/JobSearch'
import JobOfferByCategory from './screens/client/jobOfferByCategory/JobOfferByCategory'
import Jobs from './screens/user/job/Jobs'
import JobApplicationList from './screens/user/jobApplicationList/JobApplicationList'
import ShareMates from './screens/user/shareMates/ShareMates'
import AccountProfile from './screens/user/accountProfile/AccountProfile'
import Line from './screens/guest/Line'
import SharedJobs from './screens/user/shareHistory/SharedJobs'
import ForgotPassword from './screens/guest/forgotPassword/ForgotPassword'
import ResetPassword from './screens/guest/resetPassword/ResetPassword'
import PrivacyPolicy from './screens/guest/privacyPolicy/PrivacyPolicy'
import TermsOfUse from './screens/guest/termsOfUse/TermsOfUse'
import FAQ from './screens/guest/faq/FAQ'
import UserGuide from './screens/guest/userGuide/UserGuide'
import ManageJobCategories from './screens/admin/manageJobCategories/ManageJobCategories'
import EmailRegistration from './screens/guest/register/emailRegistration/EmailRegistration'
import CreateJobCategory from './screens/admin/createJobCategory/CreateJobCategory'
import RegisterForm2 from './screens/guest/register/Form2/RegisterForm2'
import RegisterForm1 from './screens/guest/register/Form1/RegisterForm1'
import RegisterForm3 from './screens/guest/register/Form3/RegisterForm3'
import Search from './screens/user/search/Search'
import Contact from './screens/guest/contact/Contact'
import Twitter from './screens/guest/Twitter'
import JobShare from './screens/user/jobShare/JobShare'
import GenericNotFound from './screens/404NotFound/404NotFound'
import CreateJob from './screens/client/createJob/CreateJob'
import ApplicantInfo from './screens/client/applicantInfo/ApplicantInfo'
import SharerInfo from './screens/client/sharerInfo/SharerInfo'
import CompanyApplicantList from './screens/client/companyApplicantList/CompanyApplicantList'
import About from './screens/guest/about/About'
import Notifications from './screens/user/notifications/Notifications'
import NotificationDetails from './screens/user/notifications/NotificationDetails'
import Hatarakikata from './screens/hatarakikata/Hatarakikata'
import TwilioVerificationCode from './screens/guest/twilio/TwilioVerificationCode'
import AdminDashboard from './screens/admin/adminDashboard/AdminDashboard'
import Billing from './screens/client/billing/Billing'
import ClientTopPage from './screens/guest/clientTopPage/ClientTopPage'

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    !!localStorage.accessToken ? (
      <Component {...props} />
    ) : (
      <Redirect to="/login" />
    )
  )} />
)

const Routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/register/form/2/:token" component={RegisterForm2} />
      <Route exact path="/register/form/1/:type/:token" component={RegisterForm1} />
      <Route exact path="/register/form/3/:token" component={RegisterForm3} />
      <Route exact path="/line" component={Line} />
      <Route exact path="/twitter" component={Twitter} />
      <Route exact path="/privacy-policy" component={PrivacyPolicy} />
      <Route exact path="/terms" component={TermsOfUse} />
      <Route exact path="/faq" component={FAQ} />
      <Route exact path="/about" component={About} />
      <Route exact path="/user-guide" component={UserGuide} />
      <Route exact path="/email-registration/:type" component={EmailRegistration} />
      <Route exact path="/contact" component={Contact} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:token" component={ResetPassword} />
      <Route exact path="/featured/:id" component={JobOfferByCategory} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/jobs" component={Jobs} />
      <Route exact path="/job-detail/:id" component={JobDetail} />
      <Route exact path="/job-share/:token" component={JobShare} />

      <Route exact path="/hatarakikata" component={Hatarakikata} />
      <Route exact path="/verify/:token" component={TwilioVerificationCode} />

      <PrivateRoute exact path="/home" component={Dashboard} />
      <PrivateRoute exact path="/share-mates" component={ShareMates} />
      <PrivateRoute exact path="/applications" component={JobApplicationList} />
      <PrivateRoute exact path="/job-offer/:id" component={JobOfferDetail} />
      <PrivateRoute exact path="/job-search" component={JobSearch} />
      <PrivateRoute exact path="/account-profile" component={AccountProfile} />
      <PrivateRoute exact path="/shared-jobs" component={SharedJobs} />
      <PrivateRoute exact path="/job-categories/create" component={CreateJobCategory} />
      <PrivateRoute exact path="/notifications" component={Notifications} />
      <PrivateRoute exact path="/notification/details/:id" component={NotificationDetails} />

      {/* Admin Routes */}
      <PrivateRoute path="/admin" component={AdminDashboard} />
      <PrivateRoute exact path="/admin/manage/job-categories" component={ManageJobCategories} />

      {/* Company Routes */}
      <PrivateRoute exact path="/applicant/:job_id/:job_seeker_id" component={ApplicantInfo} />
      <PrivateRoute exact path="/sharer/:shared_job_id" component={SharerInfo} />
      <PrivateRoute exact path="/company/jobs/:id" component={CompanyApplicantList} />
      <PrivateRoute exact path="/job/create" component={CreateJob} />
      <PrivateRoute exact path="/company/billing" component={Billing} />

      <Route exact path="/client/top-page" component={ClientTopPage} />
      <Route path='*' exact={true} component={GenericNotFound} />
    </Switch>
  </div>
)

export default Routes
