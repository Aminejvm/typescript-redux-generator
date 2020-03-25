type Props = {
  feature: string;
}

const createHookActionTemplate = ({ feature }:Props) => `
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../${feature}/actions";

function useActions(deps?) {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions, dispatch),
    deps ? [dispatch, ...deps] : [dispatch]
  );
}3

export default useActions;`;

export default createHookActionTemplate;