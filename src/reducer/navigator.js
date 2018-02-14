import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../navigators/AppNavigator';
// Start with two routes: The Main screen, with the Login screen on top.
// const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
// const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('VisitList');

const initialNavState = AppNavigator.router.getStateForAction(
    secondAction,
    // tempNavState
);

export default (state = initialNavState, action) =>{
    let nextState;
    switch (action.type) {
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}
