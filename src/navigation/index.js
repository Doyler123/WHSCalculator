import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import FindCourse from '../screens/FindCourse'
import CalculateHandicap from '../screens/CalculateHandicap'

const StackNavigator = createStackNavigator(
  {
    FindCourse: {
      screen: FindCourse
    },
    CalculateHandicap: {
      screen: CalculateHandicap
    }
  },
  {
    initialRouteName: 'FindCourse',
    headerMode: 'none',
    mode: 'modal'
  }
)

export default createAppContainer(StackNavigator)