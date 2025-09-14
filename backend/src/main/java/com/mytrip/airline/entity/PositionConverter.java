package com.mytrip.airline.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PositionConverter implements AttributeConverter<Crew.Position, String> {
    
    @Override
    public String convertToDatabaseColumn(Crew.Position position) {
        if (position == null) {
            return null;
        }
        return position.getValue();
    }
    
    @Override
    public Crew.Position convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }
        return Crew.Position.fromValue(value);
    }
}