import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  torqueCalculator,
  BoltGrade,
  LubricationCondition,
  TorqueResult,
  getAllBoltSizes,
  getAllBoltGrades,
  BoltSpecification,
} from '../modules/torque-calculator';

type PickerType = 'boltSize' | 'grade' | 'lubrication' | null;

export const TorqueCalculatorScreen: React.FC = () => {
  const { t } = useTranslation();

  const [selectedBoltSize, setSelectedBoltSize] = useState<string>('M10');
  const [selectedGrade, setSelectedGrade] = useState<BoltGrade>('8.8');
  const [selectedLubrication, setSelectedLubrication] =
    useState<LubricationCondition>('dry');
  const [result, setResult] = useState<TorqueResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showPicker, setShowPicker] = useState<PickerType>(null);

  const boltSizes = getAllBoltSizes();
  const boltGrades = getAllBoltGrades();
  const lubricationConditions: LubricationCondition[] = [
    'dry',
    'lubricated',
    'anti-seize',
  ];

  const calculateTorque = () => {
    try {
      const torqueResult = torqueCalculator.calculateTorqueAllUnits(
        selectedBoltSize,
        selectedGrade,
        selectedLubrication
      );
      setResult(torqueResult);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('errors.calculationFailed')
      );
      setResult(null);
    }
  };

  // Calculate on mount and when selections change
  React.useEffect(() => {
    calculateTorque();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoltSize, selectedGrade, selectedLubrication]);

  const handleBoltSizeSelect = (bolt: BoltSpecification) => {
    setSelectedBoltSize(bolt.size);
    setShowPicker(null);
  };

  const handleGradeSelect = (grade: BoltGrade) => {
    setSelectedGrade(grade);
    setShowPicker(null);
  };

  const handleLubricationSelect = (lubrication: LubricationCondition) => {
    setSelectedLubrication(lubrication);
    setShowPicker(null);
  };

  const renderPickerModal = () => {
    if (!showPicker) return null;

    let data: any[] = [];
    let onSelect: (item: any) => void = () => {};
    let getLabel: (item: any) => string = () => '';
    let getKey: (item: any) => string = () => '';

    if (showPicker === 'boltSize') {
      data = boltSizes;
      onSelect = handleBoltSizeSelect;
      getLabel = (bolt: BoltSpecification) =>
        `${bolt.size} (${bolt.diameter}mm)`;
      getKey = (bolt: BoltSpecification) => bolt.size;
    } else if (showPicker === 'grade') {
      data = boltGrades;
      onSelect = handleGradeSelect;
      getLabel = (grade: BoltGrade) => `Grade ${grade}`;
      getKey = (grade: BoltGrade) => grade;
    } else if (showPicker === 'lubrication') {
      data = lubricationConditions;
      onSelect = handleLubricationSelect;
      getLabel = (lube: LubricationCondition) =>
        t(`torqueCalculator.lubrication.${lube}`);
      getKey = (lube: LubricationCondition) => lube;
    }

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(null)}>
                <Text style={styles.modalCloseButton}>
                  {t('common.close')}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item: any) => getKey(item)}
              renderItem={({ item }: { item: any }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.modalItemText}>{getLabel(item)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('torqueCalculator.title')}</Text>

          {/* Bolt Size Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('torqueCalculator.boltSize')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('boltSize')}
            >
              <Text style={styles.selectorText}>{selectedBoltSize}</Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Bolt Grade Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('torqueCalculator.boltGrade')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('grade')}
            >
              <Text style={styles.selectorText}>Grade {selectedGrade}</Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Lubrication Condition Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>
              {t('torqueCalculator.lubricationCondition')}
            </Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('lubrication')}
            >
              <Text style={styles.selectorText}>
                {t(`torqueCalculator.lubrication.${selectedLubrication}`)}
              </Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Result Display */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>
                {t('torqueCalculator.recommendedTorque')}
              </Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Nm:</Text>
                <Text style={styles.resultValue}>
                  {result.Nm.toFixed(1)} Nm
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>ft-lb:</Text>
                <Text style={styles.resultValue}>
                  {result['ft-lb'].toFixed(1)} ft-lb
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>kg-m:</Text>
                <Text style={styles.resultValue}>
                  {result['kg-m'].toFixed(1)} kg-m
                </Text>
              </View>

              <View style={styles.rangeContainer}>
                <Text style={styles.rangeLabel}>
                  {t('torqueCalculator.range')}:
                </Text>
                <Text style={styles.rangeValue}>
                  {result.range.min.toFixed(1)} - {result.range.max.toFixed(1)}{' '}
                  Nm
                </Text>
              </View>
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Information Note */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {t('torqueCalculator.infoNote')}
            </Text>
          </View>
        </View>
      </ScrollView>
      {renderPickerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selector: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectorArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  resultLabel: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  rangeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
  },
  rangeLabel: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
  },
  infoContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FBC02D',
  },
  infoText: {
    fontSize: 12,
    color: '#F57F17',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    alignItems: 'flex-end',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});
