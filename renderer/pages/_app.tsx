import { AppProps } from "next/app";
import { Fragment } from "react";
import Header from "../components/Header";

import "bootstrap/dist/css/bootstrap.min.css";
import Api, { APIContext } from "../components/api/Api";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Header />
      <APIContext.Provider value={new Api()}>
        <Component {...pageProps} />
      </APIContext.Provider>
    </Fragment>
  );
}
