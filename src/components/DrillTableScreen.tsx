import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { drillTableService } from '../services/DrillTableService';
import { DrillSpecification, ThreadStandard } from '../database/types';

const THREAD_STANDARDS: ThreadStandard[] = [
  'metric-coarse',
  'metric-fine',
  'unc',
  'unf',
  'bsw',
  'bsf',
  'bsp',
  'ba',
];

export const DrillTableScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const [selectedStandard, setSelectedStandard] = useState<ThreadStandard>('metric-coarse');
  const [drillSpecs, setDrillSpecs] = useState<DrillSpecification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showStandardPicker, setShowStandardPicker] = useState<boolean>(false);

  // Load drill specifications when standard changes
  useEffect(() => {
    loadDrillSpecs();
  }, [selectedStandard]);

  const loadDrillSpecs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const specs = await drillTableService.getAllSizes(selectedStandard);
      setDrillSpecs(specs);
    } catch (err) {
      console.error('Error loading drill specs:', err);
      setError(t('errors.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleStandardSelect = (standard: ThreadStandard) => {
    setSelectedStandard(standard);
    setShowStandardPicker(false);
  };

  const renderStandardPicker = () => {
    return (
      <Modal
        visible={showStandardPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStandardPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowStandardPicker(false)}>
                <Text style={styles.modalCloseButton}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={THREAD_STANDARDS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleStandardSelect(item)}
                >
                  <Text style={styles.modalItemText}>
                    {t(`drillTable.standards.${item}`)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderDrillSpec = ({ item }: { item: DrillSpecification }) => {
    return (
      <View style={styles.specCard}>
        <View style={styles.specHeader}>
          <Text style={styles.threadSize}>{item.threadSize}</Text>
          <Text style={styles.pitch}>
            {t('drillTable.pitch')}: {item.pitch.toFixed(2)} mm
          </Text>
        </View>
        
        <View style={styles.specBody}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>{t('drillTable.tapDrillSize')} ({t('drillTable.metric')}):</Text>
            <Text style={styles.specValue}>{item.tapDrillSize.toFixed(2)} mm</Text>
          </View>
          
          {item.tapDrillSizeImperial && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>{t('drillTable.tapDrillSize')} ({t('drillTable.imperial')}):</Text>
              <Text style={styles.specValue}>{item.tapDrillSizeImperial}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('drillTable.title')}</Text>

        {/* Thread Standard Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('drillTable.threadStandard')}</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowStandardPicker(true)}
          >
            <Text style={styles.selectorText}>
              {t(`drillTable.standards.${selectedStandard}`)}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Drill Specifications List */}
        {!loading && !error && (
          <FlatList
            data={drillSpecs}
            keyExtractor={(item) => `${item.standard}-${item.threadSize}`}
            renderItem={renderDrillSpec}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('drillTable.noData')}</Text>
              </View>
            }
          />
        )}
      </View>
      {renderStandardPicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  specCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  threadSize: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pitch: {
    fontSize: 14,
    color: '#666',
  },
  specBody: {
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
