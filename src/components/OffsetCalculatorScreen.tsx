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
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  offsetCalculator,
  OffsetResult,
  OffsetParameters,
} from '../modules/offset-calculator';

type PickerType = 'angle' | null;

export const OffsetCalculatorScreen: React.FC = () => {
  const { t } = useTranslation();

  const [offsetDistance, setOffsetDistance] = useState<string>('100');
  const [selectedAngle, setSelectedAngle] = useState<number>(45);
  const [pipeDiameter, setPipeDiameter] = useState<string>('');
  const [result, setResult] = useState<OffsetResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showPicker, setShowPicker] = useState<PickerType>(null);

  const supportedAngles = offsetCalculator.getSupportedAngles();

  const calculateOffset = () => {
    try {
      // Parse inputs
      const offset = parseFloat(offsetDistance);
      const diameter = pipeDiameter ? parseFloat(pipeDiameter) : undefined;

      // Validate inputs
      if (isNaN(offset) || offset <= 0) {
        setError(t('offsetCalculator.errors.invalidOffset'));
        setResult(null);
        return;
      }

      if (pipeDiameter && (isNaN(diameter!) || diameter! < 0)) {
        setError(t('offsetCalculator.errors.invalidDiameter'));
        setResult(null);
        return;
      }

      const params: OffsetParameters = {
        offsetDistance: offset,
        angle: selectedAngle,
        pipeDiameter: diameter,
      };

      const offsetResult = offsetCalculator.calculateOffset(params);
      setResult(offsetResult);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('errors.calculationFailed')
      );
      setResult(null);
    }
  };

  // Calculate on mount and when inputs change
  React.useEffect(() => {
    calculateOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetDistance, selectedAngle, pipeDiameter]);

  const handleAngleSelect = (angle: number) => {
    setSelectedAngle(angle);
    setShowPicker(null);
  };

  const renderPickerModal = () => {
    if (!showPicker) return null;

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
              data={supportedAngles}
              keyExtractor={(item: number) => item.toString()}
              renderItem={({ item }: { item: number }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleAngleSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}°</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderDiagram = () => {
    if (!result) return null;

    const { rise, run, travel } = result;

    return (
      <View style={styles.diagramContainer}>
        <Text style={styles.diagramTitle}>
          {t('offsetCalculator.diagram')}
        </Text>
        <View style={styles.diagramBox}>
          <Text style={styles.diagramText}>
            {t('offsetCalculator.diagramLabels.rise')}: {rise.toFixed(2)}
          </Text>
          <Text style={styles.diagramText}>
            {t('offsetCalculator.diagramLabels.run')}: {run.toFixed(2)}
          </Text>
          <Text style={styles.diagramText}>
            {t('offsetCalculator.diagramLabels.travel')}: {travel.toFixed(2)}
          </Text>
          <Text style={styles.diagramText}>
            {t('offsetCalculator.diagramLabels.angle')}: {selectedAngle}°
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('offsetCalculator.title')}</Text>

          {/* Offset Distance Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              {t('offsetCalculator.offsetDistance')}
            </Text>
            <TextInput
              style={styles.input}
              value={offsetDistance}
              onChangeText={setOffsetDistance}
              keyboardType="numeric"
              placeholder={t('offsetCalculator.placeholders.offsetDistance')}
            />
          </View>

          {/* Angle Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('offsetCalculator.angle')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('angle')}
            >
              <Text style={styles.selectorText}>{selectedAngle}°</Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Pipe Diameter Input (Optional) */}
          <View style={styles.section}>
            <Text style={styles.label}>
              {t('offsetCalculator.pipeDiameter')}{' '}
              <Text style={styles.optionalText}>
                ({t('common.optional')})
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              value={pipeDiameter}
              onChangeText={setPipeDiameter}
              keyboardType="numeric"
              placeholder={t('offsetCalculator.placeholders.pipeDiameter')}
            />
          </View>

          {/* Result Display */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>
                {t('offsetCalculator.results')}
              </Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {t('offsetCalculator.resultLabels.travel')}:
                </Text>
                <Text style={styles.resultValue}>
                  {result.travel.toFixed(2)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {t('offsetCalculator.resultLabels.rise')}:
                </Text>
                <Text style={styles.resultValue}>
                  {result.rise.toFixed(2)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {t('offsetCalculator.resultLabels.run')}:
                </Text>
                <Text style={styles.resultValue}>
                  {result.run.toFixed(2)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {t('offsetCalculator.resultLabels.cutLength')}:
                </Text>
                <Text style={styles.resultValue}>
                  {result.cutLength.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Diagram */}
          {result && renderDiagram()}

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Information Note */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {t('offsetCalculator.infoNote')}
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
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  resultLabel: {
    fontSize: 16,
    color: '#388E3C',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  diagramContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  diagramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  diagramBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  diagramText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontFamily: 'monospace',
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
