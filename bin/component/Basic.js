import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Popconfirm,
  Upload,
} from 'antd';

import { handelAuth } from '@/utils/utils';
import Authorized from '@/components/Authorized/Authorized';

import styles from './Basic.less';



@connect(({ }) => ({

}))

class Basic extends PureComponent {

  contructor(props) {
    super(props)
  }

  state = {
    
  };

  /**
   * 生命周期
   */

  componentWillMount() {
  }

  componentDidMount() {
  }

  /**
   * 无状态组件
   */

  renderBasicForm() {
    const {
    } = this.props;

    return (
    );
  }

  /**
   * 状态组件render函数
   */

  render() {
    return (
      
    )
  }
}

export default Basic;
