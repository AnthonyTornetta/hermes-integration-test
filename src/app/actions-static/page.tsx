import ActionClient from '../action-client';
import { run, submit, go } from './actions';
export default function Page() {
  const secret = 'bound-static-value';
  async function bound() { 'use server'; return secret; }
  return <main><h1>Static actions</h1><ActionClient run={run} bound={bound}/>
    <form action={submit}><input name="name" defaultValue="native"/><button id="native-submit">Submit native</button></form>
    <form action={go}><button id="redirect-action">Redirect</button></form></main>;
}
