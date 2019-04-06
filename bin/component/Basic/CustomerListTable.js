import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';

import styles from './index.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ basic, loading }) => ({
  basic,
  loading: loading.models.basic,
}))
@Form.create()
class CustomerListTable extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    pagination: {},
    filtersArg: {},
    sorter: {},
  };

  // DOM 渲染
  componentDidMount() {
    const { onRef } = this.props;

    onRef(this);
    this.getData();
  }

  // 工具函数（获取表格数据，用于页面初始化，删除、更新、锁定、解锁操作之后的数据获取）
  getData = () => {
    const { dispatch } = this.props;
    const { formValues, pagination, filtersArg, sorter } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[`qp-${key}-eq`] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        params.sorter = `asc-${sorter.field}`;
      } else if (sorter.order === 'descend') {
        params.sorter = `desc-${sorter.field}`;
      }
    }

    dispatch({
      type: 'basic/fetch',
      payload: params,
    });
  };

  // 表格状态修改 parmas(pageSize/pageNumber, 表头过滤状态, 表头排序)
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.setState({
      pagination,
      filtersArg,
      sorter,
    });

    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[`qp-${key}-eq`] = getValue(filtersArg[key]); // 匹配后台api接口处理
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      if (sorter.order === 'ascend') {
        params.sorter = `asc-${sorter.field}`;
      } else if (sorter.order === 'descend') {
        params.sorter = `desc-${sorter.field}`;
      }
    }

    dispatch({
      type: 'basic/fetch',
      payload: params,
    });
  };

  // 查询条件重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'basic/fetch',
      payload: {},
    });
  };

  // 少/多量查询条件切换
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 查询按钮
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'basic/fetch',
        payload: values,
      });
    });
  };

  // 渲染少量查询条件
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      renderSimpleFormFileds,
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {renderSimpleFormFileds.map(item => (
            <Col md={8} sm={24} key={item.fieldDecorator}>
              <FormItem label={item.label}>
                {getFieldDecorator(item.fieldDecorator)(item.renderContent)}
              </FormItem>
            </Col>
          ))}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="common.list.search" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="common.list.reset" />
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <FormattedMessage id="common.list.expand" /> <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 渲染多量查询条件
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      renderAdvancedFormFileds,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {renderAdvancedFormFileds.map(item => (
            <Col md={8} sm={24} key={item.fieldDecorator}>
              <FormItem label={item.label}>
                {getFieldDecorator(item.fieldDecorator)(item.renderContent)}
              </FormItem>
            </Col>
          ))}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="common.list.search" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id="common.list.reset" />
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              <FormattedMessage id="common.list.retract" /> <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  // 查询条件切换
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 当前组件的渲染钩子函数
  render() {
    const {
      basic: { data },
      loading,

      selectedRows,
      columns,
      title,
      handleSelectRows,
      batchoperation,
    } = this.props;

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <div className={styles.List}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {batchoperation()}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerListTable;
