export const contract = {
  "backlog": {
    "detail": {
      "method": "get",
      "description": "Show a Squad task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "list": {
      "method": "get",
      "description": "List Squad backlog tasks",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "state": {
              "type": "string",
              "enum": [
                "in_flight",
                "queued",
                "held",
                "done"
              ]
            },
            "repo": {
              "type": "string"
            },
            "blocked": {
              "type": "boolean"
            },
            "kind": {
              "type": "string"
            },
            "holdKind": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "state": {
                "type": "string"
              },
              "kind": {
                "type": "string"
              },
              "repo": {
                "type": "string"
              },
              "title": {
                "type": "string"
              },
              "priority": {
                "type": "string"
              },
              "blocked_by": {
                "type": "string"
              },
              "blocked": {
                "type": "string"
              },
              "held": {
                "type": "string"
              },
              "hold_reason": {
                "type": "string"
              },
              "hold_kind": {
                "type": "string"
              },
              "links": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "state",
              "kind",
              "repo",
              "title",
              "priority",
              "blocked_by",
              "blocked",
              "held",
              "hold_reason",
              "hold_kind",
              "links"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "mutation": {
    "block": {
      "method": "post",
      "description": "Block a task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            },
            "by": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id",
            "by"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "done": {
      "method": "post",
      "description": "Complete an in-flight task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "pr": {
              "type": "string",
              "format": "uri"
            },
            "note": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "hold": {
      "method": "post",
      "description": "Hold a task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            },
            "reason": {
              "type": "string",
              "minLength": 1,
              "maxLength": 200
            },
            "kind": {
              "type": "string",
              "enum": [
                "commander",
                "external",
                "load",
                "parked",
                "future"
              ]
            },
            "until": {
              "type": "string",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
            }
          },
          "required": [
            "id",
            "reason",
            "kind"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "reopen": {
      "method": "post",
      "description": "Reopen a task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "start": {
      "method": "post",
      "description": "Start a queued task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "unblock": {
      "method": "post",
      "description": "Remove a task blocker",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            },
            "by": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id",
            "by"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "unhold": {
      "method": "post",
      "description": "Release a held task",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "pattern": "^[a-z0-9][a-z0-9-]*$"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    }
  },
  "events": {
    "method": "get",
    "description": "Stream Squad backlog changes",
    "noAuth": true,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": "custom"
  }
} as const

export default contract
