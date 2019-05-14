import React from 'react';

interface IReservationState {
  isGoing: boolean;
  numberOfGuests: number;
}

interface IReservationTouchState {
  numberOfGuests: boolean;
  isGoing: boolean;
}

interface IMiniFormikProps {
  children: (state: IMiniFormikState) => JSX.Element;
  onSubmit: (values: IReservationState) => void;
  initialValues: IReservationState;
  initialTouched: IReservationTouchState;
}

interface IMiniFormikState {
  values: IReservationState;
  touched: IReservationTouchState;
  errors: {};
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.ChangeEvent<HTMLFormElement>) => void;
}

class MiniFormik extends React.Component<IMiniFormikProps, IMiniFormikState> {
  constructor(props: IMiniFormikProps){
    super(props);
    this.state = {
      values: props.initialValues || {},
      touched: props.initialTouched || {},
      errors: {},
      handleSubmit: () => {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

 private handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const name = target.name;
    event.persist();

    this.setState(prevState => ({
      touched: {
        ...prevState.touched,
        [name]: true
      }
    }))
  }

  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    event.persist();
    
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [name]: value
      }
    }))
  }

  private handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSubmit(this.state.values)
  }

  public render(): JSX.Element {
    return <React.Fragment>{
      this.props.children({...this.state, 
        handleChange: this.handleInputChange, 
        handleBlur: this.handleBlur, 
        handleSubmit: this.handleSubmit
      })}</React.Fragment>
  }
}

class Reservation extends React.Component<{}, IReservationState> {
  private alertValues = (values: IReservationState) => {
    alert(JSON.stringify(values, null, 2))
  }

  public render(): JSX.Element {
    return (
      <MiniFormik 
        initialValues={{
          isGoing: true,
          numberOfGuests: 2
        }}
        initialTouched={{numberOfGuests: false, isGoing: false }}
        onSubmit={values => this.alertValues(values)}
       >
      {props => { 
       /**
          this is called a render prop
          it's a method for sharing code between react components.
          https://reactjs.org/docs/render-props.html
        */
        const { values, errors, touched, handleBlur, handleChange, handleSubmit } = props;
        return (
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          padding: "50px"
        }}>
        <form style={{
          width: "300px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          border: "1px blue solid",
          padding: "40px 20px"
        }}
          onSubmit={handleSubmit}
        >
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={values.isGoing}
            onChange={handleChange} 
            onBlur={handleBlur}
            />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={values.numberOfGuests}
            onChange={handleChange} 
            onBlur={handleBlur}
            />
        </label>
        <pre>{JSON.stringify(props, null, 2)}</pre>
        </form></div>
      )}}
      </MiniFormik>
    );
  }
}

export default Reservation;
