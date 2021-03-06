import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ListItem from '../component/ListItem'
import {connect} from 'react-redux';
import {goToCreateVisit, goToProfile, goToVisitDetails} from '../actions/navigation'
import {syncPhoto} from '../actions/photo'
import {refreshVisitsList, syncVisitList} from '../actions/visist'
import I18n from 'react-native-i18n'
import {visitsNavigationOptions} from "../navigators/options";
import {addIcon, photoSyncIcon, shopImage} from "../utils/images";
import GradientButton from "../component/GradientButton";
import moment from "moment"
import {allowAction} from "../utils/util";

const heightCenter = Dimensions.get('window').height * 0.5;


export class VisitListScene extends Component {

  static navigationOptions = ({navigation}) => visitsNavigationOptions(navigation);

  constructor() {
    super();
  }

  async componentDidMount() {

    /* this.props.navigation.setParams({
         handleSettings: this.openSettingsPage,
         needSync: this.props.needSync,
         isSync: this.props.isSync
     });*/

    this.props.navigation.setParams({
      handleProfile: () => {
        this.props.goToProfile()
      }
    });
  }

  refresh() {
    this.props.dispatch(refreshVisitsList(false))
  }

  /**
   *
   * @returns {*}
   */
  renderEmptyComponent() {
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large"/>
      </View>
    );
  };

  createVisit = () => {
    if (allowAction("create_visit")) {
      this.props.goToCreateVisit();
    }
  };

  /**
   * Button to create new visit
   * @returns {*}
   */
  renderNewVisit() {
    return <GradientButton icon={addIcon} style={styles.newVisitBtn}
                           text={I18n.t("visits_list.newVisit")}
                           onPress={this.createVisit}/>
  }

  /**
   * Render Section Header
   * @param title
   * @returns {*}
   */
  renderSectionHeader(title) {
    return <Text style={styles.sectionTitle}>{title}</Text>
  }

  /**
   * Fragmentation data to sections
   * @param {Array} result
   * @param {Object} visits
   * @returns {Array}
   */
  formatData(result, visits) {
    const sections = [];
    const todaySection = {data: [], title: I18n.t("visits_list.today")};
    const beforeSection = {data: [], title: I18n.t("visits_list.before")};
    const storedVisits = this.props.storedVisits;
    for (const id of result) {
      let visit;
      if (visits[id] !== undefined) {
        visit = visits[id];
      }
      if (storedVisits.has(id)) {
        visit = storedVisits.get(id)
      }
      if (storedVisits.has(String(id))) {
        visit = storedVisits.get(String(id))
      }
      if (!visit) {
        continue;
      }
      const days = Math.abs(moment(visit.started_date).startOf('day').diff(moment(new Date()).startOf('day'), 'days'));
      if (days < 1) {
        todaySection.data.push(visit);
      } else {
        beforeSection.data.push(visit);
      }
    }


    if (todaySection.data.length > 0) {
      sections.push(todaySection)
    }

    if (beforeSection.data.length > 0) {
      sections.push(beforeSection)
    }

    return sections;
  }

  /**
   *
   * @returns {*}
   */
  renderLastSyncDate() {
    const syncTime = this.props.syncTime;
    const text = I18n.t("visits_list.lastSync") + " " + moment(syncTime).fromNow();
    return (
      <View style={styles.lastSyncDateView}>
        <Image style={styles.lastSyncDateIcon} source={photoSyncIcon}/>
        <Text style={styles.lastSyncDateText}>{text}</Text>
      </View>
    )
  }

  itemClick = (item) => {
    if (allowAction("goToVisitDetails")) {
      this.props.goToVisitDetails(item.id, item.tmp)
    }
  };

  /**
   *
   * @returns {*}
   */
  render() {
    const {result, visits} = this.props;
    if (this.props.result.length === 0) {
      return (
        <View style={styles.empty}>
          <Image source={shopImage}/>
          <Text style={styles.emptyTitle}>{I18n.t('visits_list.emptyListMessageTitle')}</Text>
          <Text style={styles.emptyDetail}>{I18n.t('visits_list.emptyListMessageDetail')}</Text>
        </View>
      )
    }

    const sections = this.formatData(result, visits);

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <SectionList
            sections={sections}
            initialNumToRender={10}
            // ListHeaderComponent={() => this.renderLastSyncDate()}
            renderSectionHeader={({section}) => this.renderSectionHeader(section.title)}
            renderSectionFooter={() => <View style={{height: 7}}/>}
            renderItem={({item}) => <ListItem visit={item}
                                              onPress={() => this.itemClick(item)}/>}
            ListFooterComponent={() => <View style={{height: 70}}/>}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => this.renderEmptyComponent()}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refresh}
                onRefresh={() => this.props.refreshVisitsList()}
                tintColor="#fff"
                titleColor="#fff"
              />
            }                        // onRefresh={this.props.refreshVisitsList()}
            refreshing={this.props.refresh}
          />
        </ScrollView>
      </View>
    );
  }

}

export default connect(state => {
  const {nav, visits, photo} = state;
  return {
    nav: nav,
    syncTime: state.app.syncTime,
    result: visits.result,
    visits: visits.entities.visit,
    isFetch: visits.isFetch,
    refresh: visits.refresh,
    hasMore: visits.hasMore,
    error: visits.error,
    isSync: visits.isSync,
    storedVisits: visits.storedVisits,
    needSync: photo.needSync || visits.needSync,
  }
}, {
  goToProfile,
  goToCreateVisit,
  refreshVisitsList,
  goToVisitDetails,
  syncVisitList,
  syncPhoto
})(VisitListScene)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  innerContainer: {
    alignItems: 'center',
  },
  item: {
    // shadowColor: '#000000',
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 1,
    shadowOffset: {
      width: 0,
      height: 0.1
    },
    shadowRadius: 0.5,
    shadowOpacity: 1.0
  },
  empty: {
    flex: 1,
    //backgroundColor: "red",
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: 31,
    fontSize: 22,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000000"
  },
  emptyDetail: {
    marginTop: 15,
    width: 260,
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#9b9b9b"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#000000",
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 2
  },
  newVisitBtn: {
    position: "absolute",
    bottom: 10,
    zIndex: 1
  },
  lastSyncDateView: {
    marginTop: 14,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  lastSyncDateIcon: {
    width: 18,
    height: 18
  },
  lastSyncDateText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#b4b4b4"
  }

});