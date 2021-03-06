'use strict';

import { h, Component } from 'preact';
import * as numbers from '../lib/numbers.js';
import Client from '../lib/client.js';
import { bind } from 'decko';

const dayInSeconds = 60 * 60 * 24;

class Table extends Component {

  constructor(props) {
    super(props)

    this.state = {
      records: [],
      limit: 15,
      loading: true,
      before: props.before,
      after: props.after,
      total: 0,
    }
  }

  componentWillReceiveProps(newProps, prevState) {
      if(newProps.before == prevState.before && newProps.after == prevState.after) {
        return;
      }

      this.setState({
        before: newProps.before,
        after: newProps.after,
      });
      this.fetchRecords();
  }

  @bind
  fetchRecords() {
    this.setState({ loading: true });
    let before = this.state.before;
    let after = this.state.after;
  
    Client.request(`${this.props.endpoint}?before=${this.state.before}&after=${this.state.after}&limit=${this.state.limit}`)
      .then((d) => {
         // request finished; check if timestamp range is still the one user wants to see
        if( this.state.before != before || this.state.after != after ) {
          return;
        }

        this.setState({ 
          loading: false,
          records: d,
        });
      });

     // fetch totals too
     Client.request(`${this.props.endpoint}/pageviews?before=${this.state.before}&after=${this.state.after}`)
      .then((d) => {
        this.setState({ 
          total: d
        });
      });

  }

  render(props, state) {
    const tableRows = state.records !== null && state.records.length > 0 ? state.records.map((p, i) => {
      let ahref = document.createElement('a'); 
      ahref.href = (p.Hostname + p.Pathname) || p.URL;
      let classes = "table-row"; 
      if(state.total > 0) {
        classes += " w" + Math.min(98, Math.round(p.Pageviews / state.total * 100 * 2.5));
      }

      let label = ahref.pathname + ahref.search;
      if( props.showHostname ) {
        label = ahref.hostname.replace('www.', '') + (ahref.pathname.length > 1 ? ahref.pathname : '');
      }

      return(
      <div class={classes}>
        <div class="cell main-col"><a href={ahref.href}>{label}</a></div>
        <div class="cell">{p.Pageviews}</div>
        <div class="cell">{p.Visitors||"-"}</div>           
      </div>
    )}) : <div class="table-row">Nothing here, yet.</div>;

    return (
      <div data-total={state.total} class={"box box-pages animated fadeInUp delayed_04s "  + (state.loading ? "loading" : '')}>
        <div class="table-row header">
          {props.headers.map((header, i) => {
            let classes = i === 0 ? 'main-col cell' : 'cell';
            return (<div class={classes}>{header}</div>) 
            })}        
        </div>
        <div>
          {tableRows}
        </div>
      </div>
    )
  }
}

export default Table
