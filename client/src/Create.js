import React, { Component } from 'react';
import Step1 from './Create/Step1';
import Step2 from './Create/Step2';
import Step3 from './Create/Step3';
import './css/Form.css';
import './css/Create.css';

const PreviousButton = props => (
  <button
    type="submit"
    onClick={props.onClick}
    style={{ display: 'block', margin: '2em auto' }}
    className="button">Back
  </button>
)
class Wizard extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1
    };

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
  }

  _next() {
    let currentStep = this.state.currentStep;

    if (currentStep >= 2) {
      currentStep = 3;
    } else {
      currentStep += 1;
    }

    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    if (currentStep <= 1) {
      currentStep = 1;
    } else {
      currentStep -= 1;
    }

    this.setState({
      currentStep: currentStep
    });
  }

  render() {
    let { currentStep } = this.state;
    let activeStep = `activeStep-${currentStep}`
    return (
      <div className={activeStep}>
        <Step1 currentStep={currentStep} afterValid={this._next} />
        <Step2 currentStep={currentStep} afterValid={this._next} />
        <Step3 currentStep={currentStep} afterValid={this._next} />
        { currentStep > 1
          ? <PreviousButton onClick={this._prev}  />
          : ''
        }
      </div>
    );
  }
}

// class Create extends Component {
//   static timeout = null;
//   static timeoutInterval = 1200;

//   constructor() {
//     super();
//     this.state = {
//       target: 'someone',
//       count: 0,
//       isValid: false,
//       currentAvatarUrl: null,
//       opponentAvatarUrl: '',
//       opponentIsValidUser: null,
//       someone: ''
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleTextareaChange = this.handleTextareaChange.bind(this);
//     this.checkForUser = this.checkForUser.bind(this);
//     this.handleKeyUp = this.handleKeyUp.bind(this);
//     this.handleInput = this.handleInput.bind(this);
//   }

//   handleChange(e) {
//     this.setState({ target: e.target.value });
//   }

//   handleSubmit(e) {

//   }

//   handleInput(e) {
//     this.setState({
//       opponentIsValidUser: null,
//       someone: e.target.value,
//       opponentAvatarUrl: ''
//     });
//     clearTimeout(Create.timeout);
//   }

//   handleKeyUp(e) {
//     clearTimeout(Create.timeout);
//     Create.timeout = setTimeout(this.checkForUser, Create.timeoutInterval);
//   }

//   checkForUser() {
//     const { someone } = this.state;

//     // user can be an email or username — figure this out server-side
//     if (someone.length && someone !== auth.user.username) {
//       fetch(`/api/${someone}/isUser`)
//         .then(res => res.json())
//         .then(data => {

//           data.isUser // fetch avatar from returned username
//             ? fetch(`/api/${data.username}/avatar/username`)
//                 .then(res => res.json())
//                 .then(data => {
//                   this.setState({
//                     opponentAvatarUrl: data.avatar,
//                     opponentIsValidUser: true
//                   });
//                 })
//             : this.setState({
//               opponentAvatarUrl: '',
//               opponentIsValidUser: false
//             });
//         })
//         .catch(err => {
//           console.log('Request failed', err)
//         });
//     }
//   }

//   setAvatar() {
//     fetch(`/api/${auth.user.userid}/avatar`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.type === 'success' && data.avatar !== null) {
//           this.setState({ currentAvatarUrl: data.avatar })
//         }
//       });
//   }

//   componentDidMount() {
//     this.setAvatar();
//   }

//   handleTextareaChange(e) {
//     let count = this.state.count;
//     if (count >= 200 && count <= 1000) {
//       this.setState({ isValid: true })
//     } else {
//       this.setState({ isValid: false })
//     }
//     this.setState({ count : e.target.value.length });
//   }

//   render() {
//     const {
//       someone,
//       opponentIsValidUser,
//       opponentAvatarUrl,
//       count,
//       currentAvatarUrl
//     } = this.state;

//     const you = auth.user.username;

//     const countText = count === 1 ? 'character' : 'characters';
//     const fightTypeOptions =
//       commonData.categories.map(type => {
//         return <option key={type} value={type}>{type}</option>
//       });

//     const formAction = `/api/${auth.user.userid}/fight`;
//     const role = "note";

//     const opponentIsValidUserResult =
//       opponentIsValidUser === false
//         ? (<div className="lookupResult">
//             We could not locate <strong>{someone}</strong>
//           </div>)
//         : opponentIsValidUser === true && someone === you
//           ? (<div className="lookupResult">
//               You have an axe to grind with yourself? Save it for therapy.
//             </div>)
//           : opponentIsValidUser === true && someone !== you
//             ? (<div className="lookupResult">
//                 <CheckMarkIcon />
//                 Current opponent: <strong>{someone}</strong>
//               </div>)
//             : '';

//     return (
//       <div>
//         <h2>Start a Hatchet</h2>

//         <form
//           onSubmit={this.handleSubmit}
//           method="POST"
//           action={formAction}>
//           <div className="slots">
//             <SlotsYou
//               you={you}
//               currentAvatarUrl={currentAvatarUrl}
//             />
//             <VersusImg />
//             <SlotsThem
//               them={someone}
//               opponentAvatarUrl={opponentAvatarUrl}
//             />
//           </div>

//           <label htmlFor="opponent">Choose your opponent</label>
//           <div className="required-field-wrapper">
//             <input
//               type="text"
//               aria-label="Enter username or email address"
//               className="someone"
//               name="opponent"
//               id="opponent"
//               defaultValue={this.state.someone}
//               required
//               onInput={this.handleInput}
//               onKeyUp={this.handleKeyUp}
//               placeholder="Enter username or email address" />
//             <span className="required">*</span>
//             {opponentIsValidUserResult}
//           </div>

//           <label htmlFor="type">What type?</label>
//           <div className="styled-select slate">
//             <select name="type" id="type">
//               { fightTypeOptions }
//             </select>
//           </div>

//           <label htmlFor="title">Title it</label>
//           <div className="required-field-wrapper">
//           <input
//             type="text"
//             onChange={this.handleTextareaChange}
//             onBlur={this.handleTextareaChange}
//             name="title"
//             id="title"
//             maxLength="100"
//             required
//             placeholder="Is it okay that… Should I allow my mother to…" />
//             <span className="required">*</span>
//             <span role={role}>A good title is neutral and fair. Don't use the title to state your argument—that's what the next part is for. Consider titles starting with: <em>Is it okay that…</em> or <em>Is my boyfriend being overly jealous?</em> Get the idea?</span>
//           </div>

//           <label htmlFor="beef">Why I'm right</label>
//           <div className="required-field-wrapper">
//             <textarea
//               required
//               onChange={this.handleTextareaChange}
//               onBlur={this.handleTextareaChange}
//               name="beef"
//               id="beef"
//               placeholder="Between 200 and 1000 characters">
//             </textarea>
//             <span className="required">*</span>
//           </div>
//           <span className="characterCount">
//             {count} {countText}
//           </span>

//           <button
//             type="submit"
//             disabled={!this.state.isValid}
//             className="button full-width">Send</button>
//         </form>
//       </div>
//     );
//   };
// };

export default Wizard;
