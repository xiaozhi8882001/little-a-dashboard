import React from 'react';
import { connect } from 'dva';
import { browserHistory } from 'dva/router';
import { Layout } from '../components';
import NProgress from 'nprogress';
import classnames from 'classnames';
import '../themes/skin.less';

const { Header, Sider, LayoutStyles } = Layout;
let lastHref;

class App extends React.Component {

  render() {

    const { children, dispatch, app, loading } = this.props;
    const { sidebarFold, fullScreen, sidebarBgImg, sidebarBgColor, isShowSidebarBgImg } = app;

    const headerProps = {
      fullScreen,
      sidebarFold,
      onLock() {
        dispatch({ type: 'app/lock' });
      },
      onFull(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        dispatch({ type: 'app/switchFullScreen' })
      },
      onExitFull() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        dispatch({ type: 'app/switchFullScreen' })
      },
      onLogout() {
        browserHistory.push('/login');
      },
      onSwitchSidebar() {
        dispatch({ type: 'app/switchSidebar' });
      },
    }

    const siderbarProps = {
      sidebarFold,
    }

    const href = window.location.href;
    if (lastHref !== href) {
      NProgress.start();
      if (!loading.global) {
        NProgress.done();
        lastHref = href;
      }
    }

    return (
      <div className={classnames(LayoutStyles.layout, { [LayoutStyles.fold]: sidebarFold || false })}>
        <aside className={classnames(LayoutStyles.siderbar, LayoutStyles[`siderbar-bg-${sidebarBgColor}`])}>
          {
            isShowSidebarBgImg ?
            <div className={LayoutStyles['siderbar-bg-img']} style={{ backgroundImage: `url(${require(`../assets/img/sidebar-${sidebarBgImg}.jpg`)})` }}></div>
            :
            ''
          }
          <Sider {...siderbarProps} />
        </aside>
        <div className={LayoutStyles.main}>
          <Header {...headerProps} />
          <div className={LayoutStyles.container}>
            <div className={LayoutStyles.content}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({...state}) => ({ ...state }))(App);
