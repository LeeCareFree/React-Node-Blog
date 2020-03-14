import React, { Component, PropTypes } from 'react';
import style from './style.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Menus from '../../components/Menus';
import ArticleList from '../../components/ArticleList'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Pagination } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as frontActions } from '../../reducers/frontReducer'
const { get_article_list, get_article_detail } = frontActions;
import { actions as IndexActions } from '../../reducers/globalStateReducer'
import Login from "../../components/Login";
import { Modal } from 'antd';
import { Logined } from "../../components/Logined";
import {
    Redirect
} from 'react-router-dom'
class Home extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = ({
            showLogin: false
        })
    }

    render() {
        const { tags } = this.props;
        localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
        return (
          tags.length > 1 && this.props.match.params.tag && (tags.indexOf(this.props.match.params.tag) === -1 || this.props.location.pathname.lastIndexOf('\/') > 0)
              ?
              <Redirect to='/404'/>
              :
              <div className={style.container}>
                  <Header handleLogin={this.handleLogin}/>
                  <div className={style.nav}>
                      <Menus getArticleList={(tag)=>this.props.get_article_list(tag,1)} categories={this.props.tags} history={this.props.history}/>
                  </div>
                  <div className={style.main}>
                      <ArticleList
                          history={this.props.history}
                          data={this.props.articleList}
                          getArticleDetail={this.props.get_article_detail}
                      />
                      <div className={style.paginationContainer}>
                          <Pagination
                              defaultPageSize={10}
                              onChange={(pageNum) => {
                                  this.props.get_article_list(this.props.match.params.tag || '', pageNum);
                              }}
                              current={this.props.pageNum}
                              total={this.props.total}/>
                      </div>
                  </div>
                  <Footer />
                  <Modal visible={this.state.showLogin} footer={null} onCancel={this.onCancel}>
                  {this.props.userInfo.userId ?
                      <Logined history={this.props.history} userInfo={this.props.userInfo}/> :
                      <Login login={this.props.login} register={this.props.register}/>}
                  </Modal>
              </div>
        )
    }

    componentDidMount() {
        this.props.get_article_list(this.props.match.params.tag || '')
    }

    handleLogin = () => {
        const current = !this.state.showLogin;
        this.setState({ showLogin: current })
    }

    onCancel = () => {
      console.log('cancel')
      const current = !this.state.showLogin;
      this.setState({ showLogin: current })
    }

}


Home.defaultProps = {
    userInfo: {},
    pageNum: 1,
    total: 0,
    articleList: []
};

Home.propsTypes = {
    // isRequired是必填
    pageNum: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    articleList: PropTypes.array.isRequired
};
// 将需要的state的节点注入到与此视图数据相关的组件上
// 使用react redux库的connect方法生成容器组件前，需要先定义mapStateToProps这个函数来指定如何把当前的Redux stroe state映射到组件的props中
function mapStateToProps(state) {
    return {
        tags: state.admin.tags,
        pageNum: state.front.pageNum,
        total: state.front.total,
        articleList: state.front.articleList,
        userInfo: state.globalState.userInfo
    }
}
// 将需要绑定的响应事件注入到组件上
// 定义mapDispatchToProps方法接收dispatch方法并返回期望注入到展示组件的props中的回调方法
// 它可以使一个函数也可以是一个对象
function mapDispatchToProps(dispatch) {
    return {
        get_article_list: bindActionCreators(get_article_list, dispatch),
        get_article_detail:bindActionCreators(get_article_detail,dispatch),
        login: bindActionCreators(IndexActions.get_login, dispatch),
        register: bindActionCreators(IndexActions.get_register, dispatch)

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
