import { Provider } from 'react-redux';
import AppNavigation from './navigation/appNavigation';
import { NativeWindStyleSheet } from "nativewind";
import { store } from './redux/store';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation/>
    </Provider>
  );
}
