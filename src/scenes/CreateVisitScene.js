import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, TextInput} from 'react-native';
import {
    Container,
    Header,
    Item,
    Input,
    Text,
    Content,
    Left,
    Label,
    Body,
    Right,
    Icon,
    Title,
    Subtitle,
    Button,
    Fab, Form
} from 'native-base';
import {connect} from 'react-redux';
import {back, goToSettings, goToVisitDetails} from '../actions/navigation'
import {createVisit} from '../actions/visist'
import I18n from 'react-native-i18n'
import Toolbar from '../component/Toolbar'

export class CreateVisitScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
        }
    }


    render() {
        return (
            <Container>
                <Toolbar title={I18n.t('CreateVisit.title')} rightButton={null}/>
                <View style={{
                    flex: 1, padding: 15, justifyContent: 'center', backgroundColor: 'white'
                }}>
                    <Item floatingLabel>
                        <Label>{I18n.t('CreateVisit.label')}</Label>
                        <Input onChangeText={(text) => this.setState({text})}
                               value={this.state.text}/>
                    </Item>

                    <Button block success style={{marginTop: 20,}}
                            onPress={() => this.props.createVisit(this.state.text)}>
                        <Text>{I18n.t('CreateVisit.createAction')}</Text>
                        {this.props.isFetch ? <ActivityIndicator color="white"/> : null}
                    </Button>
                </View>
            </Container>
        )
    }
}

export default connect(state => {
    const {nav, visits} = state
    return {
        nav: nav,
        error: visits.error,
        isFetch: visits.isFetch,
        result: visits.result,


    }
}, {goToSettings, back, createVisit, goToVisitDetails})(CreateVisitScene)
