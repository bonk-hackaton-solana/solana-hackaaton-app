import {SvgArrowRightIcon} from '@shared/assets/icons/components/arrow-right-icon'
import {ButtonAction} from '@shared/ui/buttons/button-action/button-action'
import {ButtonDefault} from '@shared/ui/buttons/button-default/button-default'
import React from 'react'
import {ScrollView, Text, View} from 'react-native'

const HomeTestPurpose: React.FC = () => {
  return (
    <ScrollView
      style={{
        marginBottom: 300,
        height: 1000,
        width: '100%'
      }}>
      <View style={{flex: 1, flexDirection: 'column', gap: 20}}>
        <Text style={{color: 'red', marginBottom: 30}}>HomeTestPurpose</Text>

        <ButtonDefault text="Button" type="primary" />
        <ButtonDefault text="Button" type="primary" disabled />

        <View style={{height: 2, backgroundColor: 'blue', width: '100%'}} />

        <ButtonDefault text="Button" type="secondary" />
        <ButtonDefault text="Button" type="secondary" disabled />

        <View style={{height: 2, backgroundColor: 'blue', width: '100%'}} />

        <ButtonDefault text="Button" type="tertiary" />
        <ButtonDefault text="Button" type="tertiary" disabled />

        <View style={{height: 2, backgroundColor: 'blue', width: '100%'}} />

        <ButtonAction text="Button" variant="normal" Icon={SvgArrowRightIcon} />
        <ButtonAction text="Button" variant="circle" Icon={SvgArrowRightIcon} />
        <ButtonAction text="Button" variant="large" Icon={SvgArrowRightIcon} />
      </View>
    </ScrollView>
  )
}
export default HomeTestPurpose
